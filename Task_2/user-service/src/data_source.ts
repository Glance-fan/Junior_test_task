import { DataSource } from 'typeorm';
import { User } from './user/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'pgsql',
  database: 'database',
  entities: [User],
  migrations: ['src/migration/*.ts'],
  synchronize: true,
});