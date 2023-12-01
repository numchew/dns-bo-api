import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../common/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>,) { }

  async create(email: string, password: string): Promise<User> {
    const old = await this.findByEmail(email)
    if (old) {
      return old;
    }
    const user = new User();
    user.email = email;
    user.password = password;
    return await this.repository.save(user);
  }

  //--------------------------------------------------//
  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findAllRole(role: string): Promise<User[]> {
    return await this.repository.find({ where: { role: role } });
  }

  async findOne(id: number): Promise<Partial<User> | undefined> {
    const user = await this.repository.findOne({ where: { id: id } });
    const { password, reset_password, ...res } = user;
    return res;
  }

  /* async findByMuID(muId: string): Promise<User | undefined> {
    return await this.repository.findOne({ where: { muId: muId } });
  } */
  // ใช้หาตอน login | register
  async findByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findOne({ where: { email: email } });
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return await this.repository.findOne({ where: { username: username } });
  }

  //--------------------------------------------------//
  /* async updateByMuID(muId: string, data: Partial<User>): Promise<User | undefined> {
    const res = await this.findByMuID(muId);
    Object.assign(res, data);
    return await this.repository.save(res);
  } */

  async update(id: number, data: Partial<User>): Promise<User | undefined> {
    const res = await this.findOne(id);
    Object.assign(res, data);
    return await this.repository.save(res);
  }

  //--------------------------------------------------//
  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
  //--------------------------------------------------//
}
