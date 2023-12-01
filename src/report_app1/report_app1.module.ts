import { Module } from '@nestjs/common';
import { ReportApp1Service } from './report_app1.service';
import { ReportApp1Controller } from './report_app1.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IReport, ISituation, IQuestion, IAnswer } from '../common/entities/report_app1.entity';
import { SituationApp1Service } from './situation_app1.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IReport, ISituation, IQuestion, IAnswer]),
  ],
  controllers: [ReportApp1Controller],
  providers: [ReportApp1Service, SituationApp1Service,],
})
export class ReportApp1Module { }
