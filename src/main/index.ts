import { createConnection, getConnectionOptions } from 'typeorm';

import { env } from './config/env';

getConnectionOptions()
  .then(async (options) => {
    const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src';
    const entities = [`${root}/infra/postgres/entities/index.{js,ts}`];
    await createConnection({ ...options, entities });
    const { app } = await import('./config/app');
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  })
  .catch(console.error);
