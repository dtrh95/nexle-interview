import { NextFunction, Request, Response } from 'express';
import { TokenGetter, UnauthorizedError, expressjwt as jwt } from 'express-jwt';

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void | Response | ReturnType<typeof jwt> | Promise<void | NodeJS.Immediate> {
  if (!process.env.JWT_SECRET) {
    return response.status(401).send(UnauthorizedError);
  }

  return jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: ((req) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }) as TokenGetter,
  })(request, response, next);
}
