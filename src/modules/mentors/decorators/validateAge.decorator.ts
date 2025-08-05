import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ValidateAge(property: number, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ValidateAgeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidateAge' })
export class ValidateAgeConstraint implements ValidatorConstraintInterface {
  validate(date: any, args: ValidationArguments) {
    const [minAge] = args.constraints;
    const age = this.calculateAge(date);
    return age >= minAge;
  }

  private calculateAge(date: Date): number {
    const ageDiff = Date.now() - new Date(date).getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  }
}
