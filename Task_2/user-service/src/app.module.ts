import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';


//docker run --name my-postgres-2 -e POSTGRES_PASSWORD=pgsql -d -p 5433:5432 -v C:\Users\Max\OneDrive\Desktop\Test_Task\Task_2\pg_data:/var/lib/postgresql/data postgres
//docker exec -it my-postgres-2 psql -U postgres
//CREATE DATABASE database;


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'pgsql',
      database: 'database',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}