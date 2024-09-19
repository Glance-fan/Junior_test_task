import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// Декоратор Injectable указывает, что класс может быть использован как сервис и может быть внедрен в другие классы.
@Injectable()
export class UserService {
    constructor(
        // Декоратор InjectRepository(User), внедряет репозиторий User для выполнения операций с базой данных.
        @InjectRepository(User) 
        private readonly user_repository: Repository < User > ,
    ) {}

    /**
     * Метод для сброса флага проблем у пользователей и подсчета количества пользователей с флагом проблем = true до сброса
     * @returns Количество пользователей, у которых флаг проблем был установлен в true
     */
    async reset_problem_flags(): Promise < number > {
        // Подсчет количества пользователей с флагом проблем = true
        const count = await this.user_repository.count({ where: { has_problems: true } });

        // Сброс флага проблем has_problems у пользователей
        await this.user_repository.update({ has_problems: true }, { has_problems: false });

        return count;
    }
}