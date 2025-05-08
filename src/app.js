import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import router from './routers/router.js';
import container from './config/container.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  req.container = container.createScope();
  next();
});

app.use('/', router);
app.use(compression());
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use((req, res, next) => {
  req.container = container.createScope();
  next();
});

app.use((err, req, res, next) => {
  req.container = container.createScope();
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`😎 Servidor rodando em http://localhost:${PORT}`));
