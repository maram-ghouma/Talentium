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
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/dist/esm/plugin/landingPage/default';import { AuthModule } from './auth/auth.module';
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
  imports: [UserModule, FreelancerProfileModule, ClientProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,          
      envFilePath: '.env',     
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port:configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          logging: true,
          autoLoadEntities: true,
        };
      },
    }),
    MissionModule,AuthModule, ClientProfileModule, FreelancerProfileModule,UserModule,ReviewModule,
   GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      
    }),
   InvoiceModule,

  // ReportModule,

   DisputeModule,
   BadgeModule,
   ApplicationModule,
   PaymentModule,
   InterviewModule,],
  controllers: [AppController],
  providers: [AppService, PaymentService],
})
export class AppModule {}
