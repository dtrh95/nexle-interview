import { ROUTE_METADATA_KEY } from '@constants';
import { IRouteDefinition } from '@interfaces/route-definition.interface';

export const Post = (path: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata(ROUTE_METADATA_KEY, target.constructor)) {
      Reflect.defineMetadata(ROUTE_METADATA_KEY, [], target.constructor);
    }
    const routes: IRouteDefinition[] = Reflect.getMetadata(
      ROUTE_METADATA_KEY,
      target.constructor,
    );
    routes.push({
      requestMethod: 'post',
      path,
      methodName: propertyKey,
    });

    Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor);
  };
};
