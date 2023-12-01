import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportApp1Service } from './report_app1.service';
import { IReport, ISituation, IQuestion } from '../common/entities/report_app1.entity';
import { SituationApp1Service } from './situation_app1.service';
import { JwtAuthGuard } from '../common/guards/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('report-app1')
export class ReportApp1Controller {
  constructor(
    private readonly serviceReport: ReportApp1Service,
    private readonly serviceSituation: SituationApp1Service
  ) { }

  // http://localhost:7000/report-app1/report
  @Post('report')
  create(@Body() data: Partial<IReport>) {
    return this.serviceReport.create(data);
  }

  @Get('report')
  findAll() {
    return this.serviceReport.findAll();
  }

  // http://localhost:7000/report-app1/report/{userId}
  @Delete('report/:id')
  remove(@Param('id') id: string) {
    return this.serviceReport.remove(+id);
  }

  // http://localhost:7000/report-app1/situation/{userId}
  @Delete('situation/:id')
  removeSituation(@Param('id') userId: string) {
    return this.serviceSituation.remove(+userId);
  }

  //--------------------------------------------------//
  // Report //
  // http://localhost:7000/report-app1/report/{userId}
  @Get('report/:id')
  getReport(@Param('id') userId: string) {
    return this.serviceReport.findOneByUserId(+userId);
  }

  // name คือ situation ที่จะ update
  // {name(situation name), score?, gsex?, username?, year?}
  // http://localhost:7000/report-app1/report/{userId}
  @Patch('report/:id')
  updateReport(@Param('id') userId: string, @Body() data: Partial<IReport>) {
    return this.serviceReport.update(+userId, data);
  }
  //--------------------------------------------------//
  // Situation //
  // หา situation //
  // http://localhost:7000/report-app1/situation/{userId}?type=situationAll
  @Get('situation/:id')
  getSituation(@Param('id') userId: string, @Query('type') type: string) {
    return this.serviceSituation.findSituationType(+userId, type);
  }

  // create situation
  // http://localhost:7000/report-app1/situation/{userId}
  @Post('situation/:id')
  createSituation(@Param('id') userId: string, @Body() data: Partial<ISituation>) {
    return this.serviceSituation.createSituation(+userId, data);
  }

  // update situation
  // http://localhost:7000/report-app1/situation/{userId}?sid=9
  @Patch('situation/:id')
  updateSituation(
    @Param('id') userId: string, //@Param('situation_id') id: number,
    @Query('sid') sid: string,
    @Body() data: Partial<ISituation>,
  ) {
    return this.serviceSituation.updateSituation(+userId, +sid, data);
  }

  //--------------------------------------------------//
  // Question &  Answer //   ไม่น่าจะได้ใช้ จะใช้อัพเดตผ่าน updateSituation แทน
  // create question
  // http://localhost:7000/report-app1/question/{userId}?sid=8
  @Post('question/:id')
  createQuestion(
    @Param('id') id: string, //@Param('id') id: string,    
    @Query('sid') sid: string,
    @Body() data: Partial<IQuestion>
  ) {
    return this.serviceSituation.createQuestion(+sid, data);
  }
  //--------------------------------------------------//
}
