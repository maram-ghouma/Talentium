import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import Stripe from 'stripe';
import { Mission, PaymentStatus } from '../mission/entities/mission.entity';
import { User } from '../user/entities/user.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { FreelancerProfile } from '../freelancer-profile/entities/freelancer-profile.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FreelancerProfile)
    private freelancerRepository: Repository<FreelancerProfile>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createEscrowPayment(missionId: number, clientId: number) {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['client', 'selectedFreelancer', 'selectedFreelancer.user']
    });

    if (!mission) {
      throw new Error('Mission non trouvée');
    }

    if (!mission.selectedFreelancer) {
      throw new Error('Aucun freelancer sélectionné pour cette mission');
    }
    console.log(`Création du paiement pour la mission ${missionId} par le client ${clientId} et avec ${mission.selectedFreelancer.id} en tant que freelancer sélectionné`);
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: mission.price * 100, // Convert to cents
        currency: 'eur',
        payment_method_types: ['card'],
        capture_method: 'manual', // For escrow
        metadata: {
          missionId: missionId.toString(),
          clientId: clientId.toString(),
          freelancerId: mission.selectedFreelancer.id.toString(),
        },
      });

      await this.missionRepository.update(missionId, {
        paymentIntentId: paymentIntent.id,
        paymentStatus: PaymentStatus.ESCROWED
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
    }
  }

  async releaseMilestonePayment(missionId: number, milestonePercentage: number) {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['selectedFreelancer', 'client']
    });

    if (!mission || !mission.paymentIntentId) {
      throw new Error('Mission ou paiement non trouvé');
    }

    if (!mission.selectedFreelancer?.stripeAccountId) {
      throw new Error('Compte Stripe du freelancer non configuré');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(mission.paymentIntentId);
      const releaseAmount = Math.floor((paymentIntent.amount * milestonePercentage) / 100);

      // Capture partial payment
      const capture = await this.stripe.paymentIntents.capture(mission.paymentIntentId, {
        amount_to_capture: releaseAmount,
      });

      // Create transfer to freelancer
      await this.stripe.transfers.create({
        amount: releaseAmount,
        currency: 'eur',
        destination: mission.selectedFreelancer.stripeAccountId,
        metadata: {
          missionId: missionId.toString(),
          milestone: milestonePercentage.toString()
        }
      });

      // Generate invoice
      await this.generateInvoice(
        missionId, 
        releaseAmount / 100, 
        `Paiement jalon ${milestonePercentage}%`
      );

      // Update mission status if 100% released
      if (milestonePercentage === 100) {
        await this.missionRepository.update(missionId, {
          paymentStatus: PaymentStatus.RELEASED
        });
      }

      return { success: true, amountReleased: releaseAmount / 100 };
    } catch (error) {
      throw new Error(`Erreur lors de la libération du paiement: ${error.message}`);
    }
  }

  async generateInvoice(missionId: number, amount: number, description: string) {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['client', 'selectedFreelancer']
    });

    if (!mission || !mission.client) {
      throw new Error('Mission ou client non trouvé');
    }

    const invoice = this.invoiceRepository.create({
      amount,
      description,
      clientId: mission.client.id,
      freelancerId: mission.selectedFreelancer?.id,
      missionId: mission.id,
      client: mission.client,
      freelancer: mission.selectedFreelancer,
      mission: mission,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Generate PDF asynchronously
    this.generateInvoicePDF(savedInvoice).catch(error => {
      console.error('Error generating PDF:', error);
    });

    return savedInvoice;
  }

  private async generateInvoicePDF(invoice: Invoice) {
    // PDF generation logic with pdfkit or html-pdf
    console.log(`Génération PDF pour facture ${invoice.id}`);
    // Implementation details...
  }

  async refundPayment(missionId: number, reason: string) {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId }
    });

    if (!mission || !mission.paymentIntentId) {
      throw new Error('Mission ou paiement non trouvé');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: mission.paymentIntentId,
        reason: 'requested_by_customer',
        metadata: {
          missionId: missionId.toString(),
          reason
        }
      });

      await this.missionRepository.update(missionId, {
        paymentStatus: PaymentStatus.REFUNDED
      });

      return { success: true, refundId: refund.id };
    } catch (error) {
      throw new Error(`Erreur lors du remboursement: ${error.message}`);
    }
  }

  async getMissionsByPaymentStatus(status: PaymentStatus): Promise<Mission[]> {
    console.log(`Récupération des missions avec le statut de paiement: ${status}`);
    
    // Handle the case where we want to get missions with null/undefined paymentStatus
    // This is useful for missions that haven't been assigned a payment status yet
    let whereCondition: any;
    
    if (status === PaymentStatus.PENDING) {
      // Get missions that are either explicitly PENDING or have null paymentStatus
      whereCondition = [
        { paymentStatus: PaymentStatus.PENDING },
        { paymentStatus: IsNull() }
      ];
    } else {
      whereCondition = { paymentStatus: status };
    }

    const missions = await this.missionRepository.find({
      where: whereCondition,
      relations: ['client', 'selectedFreelancer', 'selectedFreelancer.user']
    });
    
    console.log(`Missions trouvées: ${JSON.stringify(missions, null, 2)}`);
    return missions;
  }

  async getPaymentHistory(missionId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { missionId },
      relations: ['client', 'freelancer', 'mission'],
      order: { date: 'DESC' }
    });
  }
}