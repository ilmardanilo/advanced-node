import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'hattie.db.elephantsql.com',
  port: 5432,
  username: 'saekmrrq',
  password: 'AaaIZKyB-LBmjU1K2tQdZ2PV9mm_sHuX',
  database: 'saekmrrq',
  entities: ['dist/infra/postgres/entities/index.js'],
};
