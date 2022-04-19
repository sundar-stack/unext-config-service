/* eslint-disable max-lines-per-function */
import 'reflect-metadata';
require('express-async-errors');
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import { container } from './ioc/ioc';
import './ioc/loader';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { Constants } from './constants/Constants';
import * as mongoose from 'mongoose';
import { ContextManager, ReqContextManager, Service, Logger, ServiceUtil, MageHttpClient, ProviderFactory, ApiSecurityManager, TransactionManager, TransactionManagerFactory, OrmOdms } from '@edunxtv2/service-util';
import swaggerUI = require('swagger-ui-express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDoc = require('../apidoc.json');

async function init() {
  Logger.init(Service.CONFIGURATION_SERVICE);
  await connectToMongoDb();
  initializeServer();
}

function initializeServer() {
  const server = new InversifyExpressServer(container);

  server.setConfig((app: express.Application) => {
    app.use(compression());
    app.disable('etag');
    app.use(cors());

    app.use(bodyParser.urlencoded({
      extended: true, limit: '10mb'
    }));

    app.use(bodyParser.json({ limit: '10mb' }));

    app.use((req: Request, res: Response, next: NextFunction) => {
      req.headers.instanceid = "EDUNEW";

      next();
    });

    app.use(`${Constants.CONTEXT_PATH}/api-docs`, swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    ServiceUtil.init();
    ContextManager.init(app);

    ReqContextManager.registerWithReqContextManager(app,
      [`${Constants.CONTEXT_PATH}/healthcheck`, `${Constants.CONTEXT_PATH}/domainconfiguration`,`${Constants.CONTEXT_PATH}/api-docs`]);

    MageHttpClient.init(Service.CONFIGURATION_SERVICE);
    ApiSecurityManager.switchOnApiSecurityValidation(
      app,
      [
        `${Constants.CONTEXT_PATH}/healthcheck`, `${Constants.CONTEXT_PATH}/domainconfiguration`,`${Constants.CONTEXT_PATH}/api-docs`
      ],
      Service.CONFIGURATION_SERVICE
    );

    const tranactionManager: TransactionManager = TransactionManagerFactory.getInstance(OrmOdms.MONGOOSE);
    tranactionManager.register(app);

    server.setErrorConfig(async (app) => {
      app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
        Logger.error(err, err.errId || "UNKNOWN", err.errType || "UNKNOWN");
        const production = (process.env.NODE_ENV === "production");

        if (err.code) {
          res.status(err.code).json(production ? err.toString() : err.message);
        } else {
          res.status(500)
            .json(production ? "An error occurred. Please contact your administrator if the issue persists." : err.message);
        }

        return;
      });
    });
  });

  const port = process.env.PORT || 3033;

  const instance: any = server.build().listen(port, () => {
    Logger.info(`Listening on port ${port}`);
  });
}

async function connectToMongoDb(): Promise<void> {
  const mongoUrl: any = ProviderFactory.getSecretsProvider()
    .getSecret("MONGODB_URL");

  Logger.info('Connecting to mongodb.');
  (mongoose as any).Promise = global.Promise;

  try {
    await mongoose.connect(mongoUrl, { useFindAndModify: false });
    Logger.info('Connected to mongodb.');
  } catch (err) {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit();
  }
}

module.exports.init = init;
