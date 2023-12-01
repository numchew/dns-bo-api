import { Injectable } from '@nestjs/common';
import { ISituation, IQuestion, IAnswer } from '../common/entities/report_app1.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SituationApp1Service {
  constructor(
    @InjectRepository(ISituation) private repositorySit: Repository<ISituation>,
    @InjectRepository(IQuestion) private repositoryQus: Repository<IQuestion>,
    @InjectRepository(IAnswer) private repositoryAns: Repository<IAnswer>,
  ) { }

  async createSituation(userId: number, data: Partial<ISituation>) {
    let sit = new ISituation();
    sit.userId = userId;
    sit.name = data.name;
    sit.score = data.score;
    sit.total = data.total;
    return await this.repositorySit.save(data);

  }

  async updateSituation(userId: number, sid: number, data: Partial<ISituation>) {
    var { time_start, time_finish, ...newData } = data;
    const sit = await this.findOneSituation(sid);
    Object.assign(sit, newData);
    await this.repositorySit.save(sit);
    for (const qus of sit.question) {
      if (qus) {
        console.log(qus);

        await this.createQuestion(sid, qus);
      }
    }
    return await this.findOneSituation(sid);
  }

  //--------------------------------------------------//
  // หา situation ทั้งหมดของ userId //
  async findAllSituation(userId: number) {
    return await this.repositorySit.find({
      where: { userId: userId },
      relations: ['question', 'question.ans']
    });
  }

  // หาเฉพาะ situation{1, 2, 3} ทั้งหมดของ userId //
  async findSituationType(userId: number, sitname: string) {
    const sit = await this.findAllSituation(userId);
    if (sit) {
      if (sitname.toLowerCase() !== 'situationall') {
        return sit.filter(o => o.name === sitname);
      } else {
        return sit;
      }
    }
    return null;
  }

  /* async findLatestUpdatedSituation(sid: number): Promise<ISituation> {
    return await this.repositorySit.findOne({
      where: { id: sid },
      relations: ['question', 'question.ans'],
      order: { id: 'DESC',}, // จัดเรียงตามวันที่อัปเดตจากสูงสุดไปต่ำสุด      
    });
  } */

  // หา situation{id} //
  async findOneSituation(sid: number) {
    return sid && await this.repositorySit.findOne({
      where: { id: sid },
      relations: ['question', 'question.ans']
    });
  }

  async findOneQus(id: number) {
    return id && await this.repositoryQus.findOne({ where: { id: id } });
  }
  async findOneAns(id: number) {
    return id && await this.repositoryAns.findOne({ where: { id: id } });
  }

  //--------------------------------------------------//
  // ส่งคำตอบข้อ 1, 2, 3, ...  // id ของ situation
  async createQuestion(sid: number, data: Partial<IQuestion>) {
    const sit = await this.findOneSituation(sid);
    if (sit) {
      let qus = await this.findOneQus(data.id);
      console.log(data.id);

      if (qus) {
        Object.assign(qus, data);
      } else {
        qus = await this.repositoryQus.create(data);
      }
      qus.situation = sit;
      console.log(sit.id);

      await this.repositoryQus.save(qus);

      // จำนวนที่ตอบ
      for (const a of data.ans) {
        let ans = a.id && await this.repositoryAns.findOne({ where: { id: a.id } });
        if (ans) {
          Object.assign(ans, a);
        } else {
          ans = await this.repositoryAns.create(a);
        }
        ans.question = qus;
        await this.repositoryAns.save(ans);
      }
      return await this.findOneSituation(sid);
    }
    return null;
  }
  //--------------------------------------------------//
  async removeAll(userId: number) {  // sit id
    const sit = await this.findAllSituation(userId);
    sit?.forEach(async s => { await this.remove(s.id); })
  }

  async remove(id: number) {  // sit id
    // delete question & answer
    const sit = await this.findOneSituation(id);
    if (sit) {
      for (const qus of sit.question) {
        for (const ans of qus.ans) {
          await this.repositoryAns.remove(ans);
        }
        await this.repositoryQus.remove(qus);
      }
      // delete situation
      await this.repositorySit.remove(sit);
    }
  }

  //--------------------------------------------------//
  //--------------------------------------------------//
}
