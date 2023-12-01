import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    A = 'all access',   //All access
    B = 'admin',
    C = 'tester',
    D = 'student',
    S = 'developer',    //developer
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column() muId: string;
    @Column({ length: 100, default: "" })
    username: string;
    @Column({ length: 100, default: "" })
    email: string;
    @Column({ type: 'longtext' })
    password: string;
    @Column({ default: "" })
    reset_password: string;

    @Column({ default: "" }) fname?: string;
    @Column({ default: "" }) lname?: string;
    @Column({ default: "" }) year?: string;
    //@Column() profileImage?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    date_updated: Date;

    @Column({ length: 20, default: UserRole.D })
    role: string;
}
