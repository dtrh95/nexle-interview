import { SignInDto } from '@dtos/auth/sign-in.dto';
import { getValidationMessages } from '@helpers/get-validation-messages';
import { validateSync } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function signInValidator(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const dto = new SignInDto();
  dto.email = req.body.email;
  dto.password = req.body.password;
  const errors = validateSync(dto);

  if (!errors.length) {
    return next();
  }

  res.status(400).send(getValidationMessages(errors).join(', '));
}
