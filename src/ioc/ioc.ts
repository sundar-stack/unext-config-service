import 'reflect-metadata';
import { fluentProvide } from 'inversify-binding-decorators';
import { Container, interfaces } from 'inversify';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const provideSingleton = function (identifier: interfaces.ServiceIdentifier<any>) {
  return fluentProvide(identifier)
    .inSingletonScope()
    .done();
};

export const container = new Container();
