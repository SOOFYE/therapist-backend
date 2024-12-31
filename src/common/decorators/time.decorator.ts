import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsTimeFormatConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // Matches HH:mm:ss
    return timeRegex.test(value);
  }

  defaultMessage(): string {
    return 'Time must be in the format HH:mm:ss';
  }
}

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeFormatConstraint,
    });
  };
}