import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class IReport {
    @PrimaryGeneratedColumn() id: number;
    @Column({ default: 0 }) userId: number;
    @Column({ nullable: false }) muId: string;
    @Column({ default: '' }) username: string;
    @Column({ default: '' }) year: string;
    @Column({ default: 0 }) gsex: number;
    @Column({ default: 0 }) scoreSit1: number;
    @Column({ default: 0 }) scoreSit2: number;
    @Column({ default: 0 }) scoreSit3: number;
    @Column({ default: 0 }) scorePre: number;
    @Column({ default: 0 }) scorePost: number;
    @Column({ default: 0 }) nSit1: number;
    @Column({ default: 0 }) nSit2: number;
    @Column({ default: 0 }) nSit3: number;
    @Column({ default: 0 }) nPre: number;
    @Column({ default: 0 }) nPost: number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    date_updated: Date;

    //@OneToMany(() => ISituation, ISituation => ISituation.report)
    //situation: ISituation[];      //situation => [situation1, situation2, situation3]
}

@Entity()
export class ISituation {
    @PrimaryGeneratedColumn() id: number;
    @Column({ default: 0 }) userId: number;
    //@Column({ nullable: false }) muId: string;
    //@Column() sid: number;  //1, 2, 3 (type)
    @Column({ default: '' }) name: string; //situaltion1, situaltion2, situaltion3, pretest, posttest
    @Column({ default: 0 }) score: string;
    @Column({ default: 0 }) total: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time_start: Date;
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    time_finish: Date;
    //[[qid,qus,[IAnswer]], [qid,qus,[IAnswer]], ...]
    @OneToMany(() => IQuestion, question => question.situation)
    question: IQuestion[];          //answer   //question => [question1, question2, ....]

    //@ManyToOne(() => IReport, report => report.situation)
    //@JoinColumn() report: IReport;  //[situation1, situation2, situation3] => report
}

@Entity()
export class IQuestion {
    @PrimaryGeneratedColumn() id: number;
    @Column() qid: number;  //โจทย์ข้อที่
    @Column() qus: string;
    //[[r,a], [r,a], ...]       
    @OneToMany(() => IAnswer, answer => answer.question)
    ans: IAnswer[];      //answer => [answer1, answer2, ....]

    @ManyToOne(() => ISituation, situation => situation.question)
    @JoinColumn() situation: ISituation; //[question1, question2, ....] => situation[i].question
}

@Entity()
export class IAnswer {
    @PrimaryGeneratedColumn() id: number;
    @Column() aid: number;  //ตอบครั้งที่
    @Column() r: string;    //true,false,true
    @Column() a: string;    //xx,xx,xx

    @ManyToOne(() => IQuestion, question => question.ans)
    @JoinColumn() question: IQuestion; //[answer1, answer2, ....] => question[i].answer
} 