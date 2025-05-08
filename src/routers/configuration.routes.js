import { LoggerTypes } from '#shared/constants';
import { Logger } from '#shared/utils';
import express from 'express';

const configurationRouter = express.Router();

configurationRouter.use((req, res, next) => {
  const logDetails = {
    type: LoggerTypes.Request,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  };

  Logger(JSON.stringify(logDetails, null, 2));
  next();
});

configurationRouter.post('/', (req, res) => {
  const controller = req.container.resolve('createConfigurationController');
  return controller.handle(req, res);
});

export default configurationRouter;
