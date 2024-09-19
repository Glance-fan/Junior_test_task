import { MigrationInterface,QueryRunner } from "typeorm";

export class SeedUsers1726753641846 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise < void > {
        // Используем транзакции для безопасного добавления данных
        await queryRunner.startTransaction();
        try {
            // Количество пользователей для миграции
            const user_amount = 1000000;
            for (let index = 0; index < user_amount; index++) {
                await queryRunner.query(
                    `INSERT INTO "user" (first_name, last_name, age, gender, has_problems) VALUES ('FirstName ${index}', 'LastName ${index}', ${Math.floor(Math.random() * 100)}, '${Math.random() > 0.5 ? 'Male' : 'Female'}', ${Math.random() > 0.5 ? 'true' : 'false'})`
                );
            }
            // Если все операции выполнены успешно, подтверждаем транзакцию
            await queryRunner.commitTransaction();
        } catch (err) {
            // Если произошла ошибка, откатываем транзакцию
            await queryRunner.rollbackTransaction();
            throw err;
        }
    }

    public async down(queryRunner: QueryRunner): Promise < void > {}

}