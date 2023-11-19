import chalk from 'chalk';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { AuthController } from './controllers/auth.controller';
import { MiddlewareFunction } from './decorators/controller.decorator';
import { IRouteDefinition } from './interfaces/route-definition.interface';

import { UnauthorizedError } from 'express-jwt';
import { Container } from 'typedi';
import { CLASS_MIDDLEWARE_METADATA_KEY, ROUTE_METADATA_KEY } from './constants';
import { authMiddleware } from './middlewares/auth.middleware';

dotenv.config();

const main = async (): Promise<void> => {
  const app = express();

  const port = process.env.PORT || 9000;

  app.use(express.json());

  app.use(['/sign-out', '/refresh-token'], authMiddleware);

  [AuthController].forEach((controller) => {
    const controllerInstance = Container.get(controller);
    const prefix = Reflect.getMetadata('prefix', controller);
    const routes: IRouteDefinition[] = Reflect.getMetadata(
      ROUTE_METADATA_KEY,
      controller,
    );

    const classMiddlewares: MiddlewareFunction[] = Reflect.getMetadata(
      CLASS_MIDDLEWARE_METADATA_KEY,
      controller,
    );

    if (classMiddlewares) {
      app.use(...classMiddlewares);
    }

    routes.forEach((route) => {
      if (route.middlewares) {
        app[route.requestMethod](
          prefix + route.path,
          ...route.middlewares,
          (req: Request, res: Response) => {
            (controllerInstance as any)[route.methodName](req, res);
          },
        );
      } else {
        app[route.requestMethod](
          prefix + route.path,
          (req: Request, res: Response) => {
            (controllerInstance as any)[route.methodName](req, res);
          },
        );
      }
    });
  });

  app.use((err: unknown, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof UnauthorizedError) {
      if (err.code === 'credentials_required') {
        return res.status(404).send('Token not found');
      }
      return res.status(401).send('Unauthorized');
    }
  });

  app.listen(port, () => {
    console.info(chalk.bold.blue(`App listen on port ${port}`));
  });
};

main().catch((error) => {
  console.error(chalk.bold.red(error));
});
