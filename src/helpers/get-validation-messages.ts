import { ValidationError } from 'class-validator';

export function getValidationMessages(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      constraints.push(...Object.values(error.constraints));
    }

    if (error.children) {
      constraints.push(...getValidationMessages(error.children));
    }
  }

  return constraints;
}
