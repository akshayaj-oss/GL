import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'results.json');

async function initDb() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Error initializing database', err);
  }
}

async function getResults() {
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

async function saveResult(personality: string, employee_code: string) {
  const results = await getResults();
  
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  const newResult = {
    id,
    employee_code,
    personality,
    created_at: new Date().toISOString()
  };
  
  results.push(newResult);
  await fs.writeFile(DB_FILE, JSON.stringify(results, null, 2));
  return newResult;
}

async function startServer() {
  await initDb();
  
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/results', async (req, res) => {
    try {
      const { personality, employee_code } = req.body;
      if (!personality || !employee_code) {
         res.status(400).json({ error: 'Personality and employee_code are required' });
         return;
      }
      const result = await saveResult(personality, employee_code);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/results', async (req, res) => {
    try {
      const results = await getResults();
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
