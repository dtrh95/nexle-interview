import {
  CLASS_MIDDLEWARE_METADATA_KEY,
  ROUTE_METADATA_KEY,
} from '../constants';
import { IRouteDefinition } from '../interfaces/route-definition.interface';
import { NextFunction, Request, Response } from 'express';

export type MiddlewareFunction = (
  req: Request,
  response: Response,
  next: NextFunction,
) => void;

export const Middlewares = (
  ...middlewares: MiddlewareFunction[]
): ClassDecorator & MethodDecorator => {
  return ((target, propertyKey) => {
    if (!propertyKey) {
      if (!Reflect.hasMetadata(CLASS_MIDDLEWARE_METADATA_KEY, target)) {
        Reflect.defineMetadata(
          CLASS_MIDDLEWARE_METADATA_KEY,
          middlewares,
          target,
        );
      }

      return;
    }

    if (!Reflect.hasMetadata(ROUTE_METADATA_KEY, target.constructor)) {
      Reflect.defineMetadata(ROUTE_METADATA_KEY, [], target.constructor);
    }

    const routes: IRouteDefinition[] = Reflect.getMetadata(
      ROUTE_METADATA_KEY,
      target.constructor,
    )?.map((route: IRouteDefinition) => {
      return {
        ...route,
        middlewares,
      };
    });

    Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor);
  }) as ClassDecorator & MethodDecorator;
};
