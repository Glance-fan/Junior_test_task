import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  // Импорт модуля TypeOrmModule, связывающий сущность User с репозиторием
  imports: [TypeOrmModule.forFeature([User])],

  // Определение провайдера для модуля.
  providers: [UserService],

  // Определение контроллера, обрабатывающего входящие HTTP-запросы.
  controllers: [UserController],
})
export class UserModule {}