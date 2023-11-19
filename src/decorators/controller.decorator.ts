import { ROUTE_METADATA_KEY } from '../constants';
import { NextFunction, Request, Response } from 'express';

export type MiddlewareFunction = (
  req: Request,
  response: Response,
  next: NextFunction,
) => void;

export const Controller = (prefix: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata('prefix', prefix, target);

    if (!Reflect.hasMetadata(ROUTE_METADATA_KEY, target)) {
      Reflect.defineMetadata(ROUTE_METADATA_KEY, [], target);
    }
  };
};
