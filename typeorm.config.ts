import { DataSource } from 'typeorm';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'bot',
  password: 'qwerty0908',
  database: 'bot-db',
  synchronize: false,
  entities: ['src/**/*.entity{.ts, .js}'],
  migrations: ['./src/migrations/*.ts'],
});
