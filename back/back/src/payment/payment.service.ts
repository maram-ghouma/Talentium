
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import Stripe from 'stripe';
import { Mission, PaymentStatus } from '../mission/entities/mission.entity';
import { User } from '../user/entities/user.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { FreelancerProfile } from '../freelancer-profile/entities/freelancer-profile.entity';
import { CreateEscrowResponse ,PaymentResponse} from './payment.types';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { finished } from 'stream/promises';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';


@Injectable()
export class PaymentService {
  public stripe: Stripe;

  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FreelancerProfile)
    private freelancerRepository: Repository<FreelancerProfile>,
    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });
  }
async createEscrowPayment(missionId: number, clientId: number) {
  const mission = await this.missionRepository.findOne({
    where: { id: missionId  },
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
      amount: mission.price * 100,
      currency: 'eur',
      payment_method_types: ['card'],
      capture_method: 'manual',
      confirmation_method: 'manual',
      metadata: {
        missionId: missionId.toString(),
        clientId: clientId.toString(),
        freelancerId: mission.selectedFreelancer.id.toString(),
      },
    });

    // FOR TESTING: Auto-confirm with test payment method
    const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa', // Test payment method
    });

    // Update mission status based on confirmation result
    const paymentStatus = confirmedPaymentIntent.status === 'requires_capture' 
      ? PaymentStatus.ESCROWED 
      : PaymentStatus.PENDING;

    await this.missionRepository.update(missionId, {
      paymentIntentId: paymentIntent.id,
      paymentStatus
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: confirmedPaymentIntent.status,
      readyForCapture: confirmedPaymentIntent.status === 'requires_capture'
    };
  } catch (error) {
    throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
  }
}

  // Add this method to confirm the payment after client pays
  async confirmEscrowPayment(paymentIntentId: string, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      if (paymentIntent.status === 'requires_capture') {
        // Update mission status to ESCROWED when payment is confirmed and ready to capture
        const missionId = parseInt(paymentIntent.metadata.missionId);
        await this.missionRepository.update(missionId, {
          paymentStatus: PaymentStatus.ESCROWED
        });
      }

      return paymentIntent;
    } catch (error) {
      throw new Error(`Erreur lors de la confirmation du paiement: ${error.message}`);
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
      // Check payment intent status first
      const paymentIntent = await this.stripe.paymentIntents.retrieve(mission.paymentIntentId);
      
      console.log(`PaymentIntent status: ${paymentIntent.status}`);
      
      if (paymentIntent.status !== 'requires_capture') {
        throw new Error(`Le paiement ne peut pas être capturé. Status actuel: ${paymentIntent.status}. Status requis: requires_capture`);
      }

      const releaseAmount = Math.floor((paymentIntent.amount * milestonePercentage) / 100);

      // Capture partial payment
      const capture = await this.stripe.paymentIntents.capture(mission.paymentIntentId, {
        amount_to_capture: releaseAmount,
      });

      // Create transfer to freelancer
      await this.stripe.transfers.create({
        amount: releaseAmount,
        currency: 'eur',
        //destination: mission.selectedFreelancer.stripeAccountId,
        destination: 'acct_1RWz0BRBiMgVeRzi', // Test account for now
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
      console.error('Stripe error:', error);

      if (error.type === 'StripeInvalidRequestError') {
        // Invalid parameters or configuration
        throw new HttpException(
          {
            message: 'Invalid request to Stripe. Please contact support.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error.type === 'StripeCardError' || error.code === 'balance_insufficient') {
        // Not enough funds in test mode or real
        throw new HttpException(
          {
            message: 'Payment failed due to insufficient Stripe account funds. Please try again later.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generic fallback for unknown Stripe errors
      throw new HttpException(
        {
          message: 'An unexpected Stripe error occurred. Please try again.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
      //throw new Error(`Erreur lors de la libération du paiement: ${error.message}`);
      
    
  }

  // Add method to check payment status
  async getPaymentIntentStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        capturable: paymentIntent.status === 'requires_capture'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du statut: ${error.message}`);
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
   /* this.generateInvoicePDF(savedInvoice).catch(error => {
      console.error('Error generating PDF:', error);
    });*/
    /*console.log(`Invoice generated with IDddddddddddddd: ${savedInvoice.id}`);
    await this.generateInvoicePDFBuffer(savedInvoice).catch(error => {
    console.error('Error generating PDF buffer:', error);
  });*/

    return savedInvoice;
  }


async generateInvoicePDFBuffer(inv: Invoice): Promise<{ buffer: Buffer; filename: string }> {

const invoice = await this.invoiceRepository.findOne({
  where: { id: inv.id },
  relations: ['client', 'freelancer', 'mission', 'freelancer.user'],
});
if (!invoice) {
  throw new Error('Invoice not found');
}
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve({
        buffer,
        filename: `facture_${invoice.id}.pdf`
      });
    });
    doc.on('error', reject);

    doc
      .fontSize(24)
      .text('FACTURE', { align: 'center' })
      .moveDown(1.5);

    doc
      .fontSize(12)
      .text(`Facture n° : ${invoice.id}`)
      .text(`Date : ${invoice.date}`)
      .text(`Client : ${invoice.client?.username || 'N/A'}`)
      .text(`Montant : ${parseFloat(typeof invoice.amount === 'string' ? invoice.amount : String(invoice.amount || 0)).toFixed(2)} €`)
      .text(`Freelancer : ${invoice.freelancer?.user?.username || 'N/A'}`)
      .moveDown();

    doc
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke()
      .moveDown();

    doc
      .fontSize(14)
      .text('Détails de la mission :', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(`Description : ${invoice.description}`)
      .text(`Montant à payer : ${(typeof invoice.amount === 'string' ? parseFloat(invoice.amount) : Number(invoice.amount || 0)).toFixed(2)} €`)
      .moveDown(2);

    doc
      .fontSize(10)
      .fillColor('gray')
      .text('Merci pour votre confiance.', { align: 'center' });

    doc.end();
  });
}
  private async generateInvoicePDF(invoice: Invoice) {
  const load = await this.invoiceRepository.findOne({
    where: { id: invoice.id },
    relations: ['client', 'freelancer', 'mission','freelancer.user'],
  });

  if (!load) {
    throw new Error('Invoice not found');
  }

  const uploadsDir = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, `facture_${load.id}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Content
  doc
    .fontSize(24)
    .text('FACTURE', { align: 'center' })
    .moveDown(1.5);

  doc
    .fontSize(12)
    .text(`Facture n° : ${load.id}`)
    .text(`Date : ${load.date}`)
    .text(`Client : ${load.client?.username || 'N/A'}`)
    .text(`Montant : ${parseFloat(typeof load.amount === 'string' ? load.amount : String(load.amount || 0)).toFixed(2)} €`)
    .text(`Freelancer : ${load.freelancer?.user?.username || 'N/A'}`)
    .moveDown();

  doc
    .moveTo(doc.x, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke()
    .moveDown();

  doc
    .fontSize(14)
    .text('Détails de la mission :', { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Description : ${load.description}`)
    .text(`Montant à payer : ${(typeof load.amount === 'string' ? parseFloat(load.amount) : Number(load.amount || 0)).toFixed(2)} €`)
    .moveDown(2);

  doc
    .fontSize(10)
    .fillColor('gray')
    .text('Merci pour votre confiance.', { align: 'center' });

  doc.end();

  // ✅ Wait for the file to finish writing
  await finished(writeStream);

  console.log(`PDF enregistré avec succès dans : ${filePath}`);
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
  async getPendingMissionsByClient(userId: number): Promise<Mission[]> {
    const missions = await this.getMissionsByPaymentStatus(PaymentStatus.PENDING);
    const clientID=await this.clientProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
    if (!clientID) {
      throw new HttpException('Client non trouvé', HttpStatus.NOT_FOUND);
    }
    console.log(`Client trouvé: ${clientID.user.username} (${clientID.user.id})`);
    
    const clientMissions = missions.filter(mission => mission.client.id === clientID.id);
    if (clientMissions.length === 0) {
      throw new HttpException('Aucune mission en attente trouvée pour ce client', HttpStatus.NOT_FOUND);
    }
    console.log(`Récupération des missions en attente pour le client ${userId}`);
    return clientMissions;
  }

  async getMissionsByPaymentStatus(status: PaymentStatus): Promise<Mission[]> {
    console.log(`Récupération des missions avec le statut de paiement: ${status}`);
    
    let whereCondition: any;
    
    if (status === PaymentStatus.PENDING) {
      whereCondition = [
        { paymentStatus: PaymentStatus.PENDING },
        { paymentStatus: IsNull() }
      ];
    } else if (status === PaymentStatus.ESCROWED) {
      whereCondition = { paymentStatus: PaymentStatus.ESCROWED };
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

  async getMissionById(missionId: number): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['client', 'selectedFreelancer', 'selectedFreelancer.user','client.user']
    });

    if (!mission) {
      throw new Error('Mission non trouvée');
    }

    return mission;
  }
  async getPaymentHistory(missionId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { missionId },
      relations: ['client', 'freelancer', 'mission'],
      order: { date: 'DESC' }
    });
  }
  async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentResponse> {
  try {
    const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
    return {
      success: true,
      message: 'Payment confirmed successfully',
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    throw new Error(`Failed to confirm payment: ${error.message}`);
  }
}

async retryPaymentSetup(missionId: number): Promise<CreateEscrowResponse> {
  const mission = await this.missionRepository.findOne({ where: { id: missionId } });
  if (!mission) {
    throw new Error('Mission not found');
  }
  
  if (mission.paymentIntentId) {
    try {
      await this.stripe.paymentIntents.cancel(mission.paymentIntentId);
    } catch (error) {
      console.warn('Could not cancel old payment intent:', error.message);
    }
  }
  
  return this.createEscrowPayment(missionId, mission.client.user.id);
}
}