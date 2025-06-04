
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Mission } from '../mission/entities/mission.entity';
import { User } from '../user/entities/user.entity';
import { Invoice } from '../invoice/entities/invoice.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  ESCROWED = 'ESCROWED',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED'
}

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {
    //stripe test secret key : "sk_test_51OyjfCLP09EeDvhaQKed2zemxoS5nkUOnsy22lqz52tXfxWCrs7sUIMxDGLIyWyoqCXY9vfjkS44Yhkqb0eeBCNq00ksDn2Xnc" in .env
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createEscrowPayment(missionId: number, clientId: number) {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['client', 'selectedFreelancer']
    });

    if (!mission) {
      throw new Error('Mission non trouvée');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: mission.price * 100, 
        currency: 'eur',
        payment_method_types: ['card'],
        capture_method: 'manual', //pour l'escrow
        metadata: {
          missionId: missionId.toString(),
          clientId: clientId.toString(),
          freelancerId: mission.selectedFreelancer?.id.toString() || '',
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
      relations: ['selectedFreelancer']
    });

    if (!mission || !mission.paymentIntentId) {
      throw new Error('Mission ou paiement non trouvé');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(mission.paymentIntentId);
      const releaseAmount = Math.floor((paymentIntent.amount * milestonePercentage) / 100);

      // Capturer partiellement le paiement
      const capture = await this.stripe.paymentIntents.capture(mission.paymentIntentId, {
        amount_to_capture: releaseAmount,
      });

      // Créer un transfert vers le freelancer
      if (!mission.selectedFreelancer || !mission.selectedFreelancer.stripeAccountId) {
        throw new Error('Freelancer ou compte Stripe du freelancer non trouvé');
      }
      await this.stripe.transfers.create({
        amount: releaseAmount,
        currency: 'eur',
        destination: mission.selectedFreelancer.stripeAccountId,
        metadata: {
          missionId: missionId.toString(),
          milestone: milestonePercentage.toString()
        }
      });

      
      await this.generateInvoice(missionId, releaseAmount / 100, `Paiement jalon ${milestonePercentage}%`);

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
      date: new Date().toISOString(),
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    await this.generateInvoicePDF(savedInvoice);

    return savedInvoice;
  }

  private async generateInvoicePDF(invoice: Invoice) {
    // Logique de génération PDF avec pdfkit ou html-pdf
  
    console.log(`Génération PDF pour facture ${invoice.id}`);
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
}