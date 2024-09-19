import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Декоратор Entity указывает, что этот класс представляет таблицу в базе данных
@Entity()
export class User {
  // Декоратор PrimaryGeneratedColumn указывает, что это первичный ключ таблицы, который автоматически генерируется
  @PrimaryGeneratedColumn()
  id: number;

  // Декоратор Column указывает, что это обычный столбец в таблице базы данных
  // Имя пользователя
  @Column()
  first_name: string;

  // Фамилия пользователя
  @Column()
  last_name: string;

  // Возраст пользователя
  @Column()
  age: number;

  // Пол пользователя
  @Column()
  gender: string;

  // Этот столбец указывает на наличие проблем у пользователя
  @Column({ default: false })
  has_problems: boolean;
}