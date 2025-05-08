import { asClass, asValue, createContainer, Lifetime } from 'awilix';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const container = createContainer();

dotenv.config();

container.register({
  env: asValue({
    AUTH_URL: process.env.AUTH_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    OPENFINANCE_BASE_URL: process.env.OPENFINANCE_BASE_URL,
  }),
  logger: asValue(console),
});

const cwd = path.join(__dirname, '..');
const patterns = [
  'controllers/*.controller.js',
  'gateways/*.gateway.js',
  'use-cases/*.interactor.js',
  'presenters/*.presenter.js',
];

/*
const found = await fg(patterns, { cwd });
console.log('🔍 fast‑glob encontrou:', found);
console.log('🔐 Variáveis de ambiente:', container.resolve('env'));
*/

await container.loadModules(patterns, {
  cwd,
  formatName: 'camelCase',
  resolverOptions: {
    register: asClass,
    lifetime: Lifetime.SCOPED,
    injectionMode: 'PROXY',
    injector: (container) => ({
      baseURL: container.resolve('env').OPENFINANCE_BASE_URL,
      authUrl: container.resolve('env').AUTH_URL,
      clientId: container.resolve('env').CLIENT_ID,
      clientSecret: container.resolve('env').CLIENT_SECRET,
      logger: container.resolve('logger'),
    }),
  },
  esModules: true,
});

export default container;
