import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventManagementModuleModule } from './event-management-module/event-management-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.register({
      store: 'redis', 
      host: 'localhost',
      port: 6379, 
      ttl: 6000, 
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.MY_DB,
      synchronize: true,
      entities: [__dirname + '/../../**/entities/*.entity.js'],
      autoLoadEntities: true,
      logging: false
    }),
    EventManagementModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
