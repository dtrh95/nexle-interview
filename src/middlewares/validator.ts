import { MiddlewareFunction } from '../decorators/controller.decorator';
import { NextFunction, Request, Response } from 'express';

const validatorMiddleware: MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next();
};

export { validatorMiddleware };
