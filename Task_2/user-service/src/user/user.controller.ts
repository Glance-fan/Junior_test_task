import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

// Декоратор Controller('users') указывает, что класс UserController является контроллером и обрабатывает запросы, начинающиеся с пути /users.
@Controller('users')
export class UserController {
    constructor(private readonly user_service: UserService) {}

    /**
     * Endpoint для сброса флага проблем у пользователей
     * @returns Объект, содержащий количество пользователей, у которых флаг проблем был установлен в true до сброса
     */
    // Декоратор Post('reset-problems') указывает, что метод reset_problems обрабатывает POST-запросы по пути /users/reset-problems 
    @Post('reset-problems')
    async reset_problems(): Promise <{ updated_count: number }> {
         // Вызов метода сервиса для получения количества пользователей с флагом has_problems = true и сброса флага проблем на false
        const updated_count = await this.user_service.reset_problem_flags();

        return { updated_count };
    }
}