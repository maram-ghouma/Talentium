import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FreelancerProfileModule } from './freelancer-profile/freelancer-profile.module';
import { ClientProfileModule } from './client-profile/client-profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionModule } from './mission/mission.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { ConversationModule } from './conversation/conversation.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/entities/user.entity';
import { Conversation } from './conversation/entities/conversation.entity';
import { Message } from './conversation/entities/message.entity'; // Import Message entity
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import { NotificationGateway } from './notification/notification.gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/dist/esm/plugin/landingPage/default';
import { InvoiceModule } from './invoice/invoice.module';

//import { ReportModule } from './report/report.module';

import { ReviewModule } from './review/review.module';
import { DisputeModule } from './dispute/dispute.module';
import { BadgeModule } from './badge/badge.module';
import { ApplicationModule } from './application/application.module';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';
import { InterviewModule } from './interview/interview.module';

//import { DatasetService } from './generate-dataset.service';



@Module({
  imports: [
    UserModule,
    FreelancerProfileModule,
    ClientProfileModule,
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        logging: true,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Conversation, Message]), // Add Message here
    MissionModule,AuthModule, ClientProfileModule, FreelancerProfileModule,UserModule,ReviewModule,
   GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
    ConversationModule,
    InvoiceModule,
    DisputeModule,
    BadgeModule,
   ApplicationModule,
   PaymentModule,
   InterviewModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatGateway, ChatService],
})
export class AppModule {}