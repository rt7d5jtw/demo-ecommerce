import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function parseBool(str: string): boolean {
  return str === 'true' ? true : str === 'false' ? false : false;
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER ? process.env.DB_USER : 'postgres',
  password: process.env.DB_PASS ? process.env.DB_PASS : 'postgres',
  database: process.env.DATABASE ? process.env.DATABASE : 'bookstore',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.DB_SYNC ? parseBool(process.env.DB_SYNC) : false,
};
