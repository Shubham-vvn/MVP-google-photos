import { createServer } from './server.js';
import { config } from './config/index.js';

const app = createServer();

app.listen(config.PORT, () => {
  console.log(`[Google Photos Memory API] Server running on port ${config.PORT} [${config.NODE_ENV}]`);
  console.log(`[Health check] http://localhost:${config.PORT}/healthz`);
});
