// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './dataSource';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
