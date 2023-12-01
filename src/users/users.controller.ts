import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from '../common/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.strategy';
import { RolesGuard } from '../common/guards/roles.guard';
import { hasRoles } from '../common/guards/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() data: Partial<User>) {
    return this.usersService.create(data.username, data.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.S, UserRole.A, UserRole.B, UserRole.C)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.S, UserRole.A, UserRole.B, UserRole.C)
  @Get('role/:role')
  findAllRole(@Param('role') role: string) {
    return this.usersService.findAllRole(role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.S, UserRole.A, UserRole.B, UserRole.C)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  //--------------------------------------------------//
  //http://localhost:7000/users/0000000001/profile
  // userId คือ muId
  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  getProfile(@Param('id') userId: string) {
    return this.usersService.findOne(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/profile')
  updateProfile(@Param('id') userId: string, @Body() data: Partial<User>) {
    return this.usersService.update(+userId, data);
  }
  //--------------------------------------------------//
}
