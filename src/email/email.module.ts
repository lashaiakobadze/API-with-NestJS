
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EmailService from './email.service';
import EmailSchedulingController from './emailSchedule.controller';
import EmailSchedulingService from './emailScheduling.service';
 
@Module({
  imports: [ConfigModule],
  controllers: [EmailSchedulingController],
  providers: [EmailService, EmailSchedulingService],
  exports: [EmailService, EmailSchedulingService]
})
export class EmailModule {}