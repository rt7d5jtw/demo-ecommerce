import { TypeOrmModuleOptions } from '@nestjs/typeorm';
const config = require('config');

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type || 'postgres',
  host: dbConfig.host, // dbConfig.host
  port: dbConfig.port || 5432,
  username: dbConfig.username || 'postgres',
  password: dbConfig.password || 'postgres',
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
};
