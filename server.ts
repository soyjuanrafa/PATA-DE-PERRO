import express from 'express';
import http from 'http';
import path from 'path';
import * as dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getUsers, getOrCreateUser, clearAllUsers } from './src/db/users.ts';
import { getExperiencias, getReservas, getAnfitriones, getPuntosInteresRa, createReservaSync } from './src/db/turismo.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Pata de Perro - Turismo Auténtico y Sostenible',
      cloudSql: {
        enabled: true,
        region: 'us-west1',
        database: process.env.SQL_DB_NAME || 'ai_studio_db',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Cloud SQL Status endpoint
  app.get('/api/cloudsql/status', (req, res) => {
    res.json({
      enabled: true,
      region: 'us-west1',
      engine: 'PostgreSQL 16 (Cloud SQL Developer Edition)',
      tables: ['users', 'turistas', 'anfitriones', 'experiencias', 'reservas', 'puntos_interes_ra'],
      proxy: process.env.SQL_HOST ? 'connected' : 'configured',
    });
  });

  // User synchronization with Cloud SQL and Firebase Auth token
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email;
      if (!uid || !email) {
        return res.status(400).json({ error: 'UID y correo son requeridos.' });
      }

      const { nombre, role } = req.body;
      const user = await getOrCreateUser(uid, email, nombre, role);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Error syncing user to Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Error al sincronizar usuario.' });
    }
  });

  // Authenticated route to get users from Cloud SQL
  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allUsers = await getUsers();
      res.json(allUsers);
    } catch (error: any) {
      console.error('Failed to fetch users from Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // Endpoint to clear all users from the database
  app.delete('/api/users', async (req, res) => {
    try {
      const result = await clearAllUsers();
      res.json(result);
    } catch (error: any) {
      console.error('Failed to clear users from Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Failed to clear users' });
    }
  });

  // Tourism data endpoints with Cloud SQL
  app.get('/api/experiencias', async (req, res) => {
    try {
      const items = await getExperiencias();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener experiencias' });
    }
  });

  app.get('/api/reservas', requireAuth, async (req: AuthRequest, res) => {
    try {
      const items = await getReservas();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener reservas' });
    }
  });

  app.post('/api/reservas', requireAuth, async (req: AuthRequest, res) => {
    try {
      const saved = await createReservaSync(req.body);
      res.json({ success: true, reserva: saved });
    } catch (error: any) {
      console.error('Error syncing reserva to Cloud SQL:', error);
      res.status(500).json({ error: error.message || 'Error al guardar reserva' });
    }
  });

  app.get('/api/anfitriones', async (req, res) => {
    try {
      const items = await getAnfitriones();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener anfitriones' });
    }
  });

  app.get('/api/puntos-interes-ra', async (req, res) => {
    try {
      const items = await getPuntosInteresRa();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener puntos RA' });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
