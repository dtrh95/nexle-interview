import { SignUpDto } from '../dtos/auth/sign-up.dto';
import { getValidationMessages } from '../helpers/get-validation-messages';
import { validateSync } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function signUpValidator(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const dto = new SignUpDto();
  dto.email = req.body.email;
  dto.password = req.body.password;
  dto.firstName = req.body.firstName;
  dto.lastName = req.body.lastName;
  const errors = validateSync(dto);

  if (!errors.length) {
    return next();
  }

  res.status(400).send(getValidationMessages(errors).join(', '));
}
