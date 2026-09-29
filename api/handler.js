import { createServer } from '../dist/server.js';

let app;

export default function handler(req, res) {
  try {
    if (!app) {
      app = createServer();
    }
    return app(req, res);
  } catch (error) {
    console.error('Vercel API Handler Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: error?.message || 'Server error',
    }));
  }
}
