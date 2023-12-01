import { Injectable } from '@nestjs/common';
import { IReport } from '../common/entities/report_app1.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SituationApp1Service } from './situation_app1.service';

@Injectable()
export class ReportApp1Service {
  constructor(
    @InjectRepository(IReport) private repositoryReport: Repository<IReport>,
    private situationApp1Service: SituationApp1Service,
  ) { }

  async create(data: Partial<IReport>) {
    const old = await this.findOneByUserId(data.userId); // มีอยู่แล้ว?
    if (old) {
      return await this.update(data.userId, data);
    }
    const newReport = await this.repositoryReport.save(data);
    return await this.findOneByUserId(newReport.userId);
  }

  //--------------------------------------------------//
  async findAll() {
    return await this.repositoryReport.find();
  }
  async findOne(id: number) {
    return await this.repositoryReport.findOne({ where: { id: id } });
  }
  // getReport //
  async findOneByUserId(userId: number) {
    return await this.repositoryReport.findOne({ where: { userId: userId } });
  }

  // getReport //
  /* async findOneByMuId(muId: string) {
    return await this.repositoryReport.findOne({ where: { muId: muId } });
  } */

  //--------------------------------------------------//
  // {name(situation name), score?, gsex?, username?, year?}
  // updateReport //  เมื่อเลือกตัวละครหรือ add score
  async update(userId: number, data: Partial<IReport>) {
    let report = await this.findOneByUserId(userId);
    Object.assign(report, data);
    /* report.username = data.username && data.username;
    report.year = data.year && data.year;
    report.gsex = data.gsex && data.gsex; */
    /* const sit = await this.situationApp1Service.findSituationType(userId, data.name);
    switch (data.name) {
      case 'situation1': report.scoreSit1 = data.score; report.nSit1 = sit ? sit.length : 0; break;
      case 'situation2': report.scoreSit2 = data.score; report.nSit2 = sit ? sit.length : 0; break;
      case 'situation3': report.scoreSit3 = data.score; report.nSit3 = sit ? sit.length : 0; break;
      case 'pretest': report.scorePre = data.score; report.nPre = sit ? sit.length : 0; break;
      case 'posttest': report.scorePost = data.score; report.nPost = sit ? sit.length : 0; break;
    } */

    const sit1 = await this.situationApp1Service.findSituationType(userId, 'situation1');
    report.nSit1 = sit1 ? sit1.length : 0;
    const sit2 = await this.situationApp1Service.findSituationType(userId, 'situation2');
    report.nSit2 = sit2 ? sit2.length : 0;
    const sit3 = await this.situationApp1Service.findSituationType(userId, 'situation3');
    report.nSit3 = sit3 ? sit3.length : 0;
    const pretest = await this.situationApp1Service.findSituationType(userId, 'pretest');
    report.nPre = pretest ? pretest.length : 0;
    const posttest = await this.situationApp1Service.findSituationType(userId, 'posttest');
    report.nPost = posttest ? posttest.length : 0;

    //await this.repositoryReport.update({ muId: muId }, report); ใช้ .update จะไม่ update date_updated
    await this.repositoryReport.save(report);
    return await this.findOneByUserId(userId);
  }

  //--------------------------------------------------//
  // remove report
  async remove(id: number) {
    // delete situation
    const report = await this.findOne(id);
    if (report) {
      await this.situationApp1Service.removeAll(report.userId);
    }

    // delete report
    await this.repositoryReport.delete(id); //id ของ IReport
  }
  //--------------------------------------------------//
}
