/*
 * Open Syk @common
 * MIT Licensed
 */

export function orThrowError(errorType: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (args.length !== 2) {
        throw new Error(
          'Exactly 2 arguments are required. response: any, messageError: string',
        );
      }
      if (!args[0]) {
        throw new errorType(args[1]);
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
