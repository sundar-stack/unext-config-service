import { v4 } from 'uuid';

export class Utils {

  public static ERROR_CODE_ENTITY_EXISTS = "ENTITY_EXISTS";

  public static ERROR_CODE_MISSING_ENTITITES = "MISSING_ENTITIES";

  public static createValidationError(message: string): Error {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = new Error(message);
    err.status = 400;
    return err;
  }

  public static validateStringNotEmpty(str: string, name: string): void {
    if (str === null || typeof str === "undefined") {
      throw Utils.createValidationError(`${name} may not be null, undefined or blank`);
    }

    if (typeof str !== "string") {
      throw Utils.createValidationError(`${name} must be of type string`);
    }

    if (str.trim().length === 0) {
      throw Utils.createValidationError(`${name} may not be null, undefined or blank`);
    }
  }

  public static validateIsNotNullOrUndefined(param: Array<string>, name: string): void {
    if (param === null || typeof param === "undefined") {
      throw Utils.createValidationError(`${name} may not be null or undefined`);
    }
  }

  public static validateIsNonEmptyStringArray(arr: string[], name: string): void {
    Utils.validateArrayNotEmpty(arr, name);

    for (const value of arr) {
      Utils.validateStringNotEmpty(value, `${name} elements`);
    }
  }

  public static validateArrayNotEmpty(arr: string[], name: string): void {
    try {
      if (arr === null || typeof arr === "undefined") {
        throw Utils.createValidationError(`${name} may not be null, undefined or empty`);
      }

      if (!Array.isArray(arr)) {
        throw Utils.createValidationError(`${name} is not an array`);
      }

      if (arr.length === 0) {
        throw Utils.createValidationError(`${name} may not be null, undefined or empty`);
      }
    } catch (err) {
      err.status = 400;
      throw err;
    }
  }

  //public static validateJsonObj(obj: string, schema: any): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static generateUuid() {
    return v4();
  }
}