import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReportApp1Module } from './report_app1/report_app1.module';

//import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /* TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...require(path.resolve(__dirname, 'ormconfig.js')),
      }),
    }), */

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ReportApp1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
