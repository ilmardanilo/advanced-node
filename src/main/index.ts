import { createConnection } from 'typeorm';
import { app } from './config/app';
import { env } from './config/env';

createConnection()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  })
  .catch(console.error);
