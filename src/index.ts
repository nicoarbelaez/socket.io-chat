import express from 'express';
import path from 'path';
import { createApp } from './server';
import { fileURLToPath } from 'url';

const { app, httpServer } = createApp();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configureStaticAssets = () => {
  const publicPath = path.join(__dirname, './public');
  app.use(express.static(publicPath));

  app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
};

const configureRoutes = () => {
  app.get('/test', (req, res) => {
    res.json({ message: 'test' });
  });
};

const startServer = async () => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

(async () => {
  configureStaticAssets();
  configureRoutes();
  await startServer();
})();
