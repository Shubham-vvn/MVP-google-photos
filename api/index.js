import { createServer } from '../dist/server.js';

const app = createServer();

export default function handler(req, res) {
  return app(req, res);
}
