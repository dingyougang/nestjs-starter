import { SetMetadata } from '@nestjs/common';
import { Actions } from '../enum/actions.enum';
import { Reflector } from '@nestjs/core';

export const PERMISSION_KEY = 'permission';

const accumulatePermissions = (key: string, permission: string) => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const reflector = new Reflector();
    // 针对方法的
    if (descriptor && descriptor.value) {
      const permissions = reflector.get(key, descriptor.value) || [];
      const newPermissions = [...permissions, permission];
      SetMetadata(key, newPermissions)(target, propertyKey, descriptor);
    } else {
      // 针对类的
      const permissions = reflector.get(key, target) || [];
      const newPermissions = [...permissions, permission];
      SetMetadata(key, newPermissions)(target);
    }
  };
};
export const Permission = (permissions: string) =>
  accumulatePermissions(PERMISSION_KEY, permissions);
export const Create = () =>
  accumulatePermissions(PERMISSION_KEY, Actions.CREATE.toLocaleLowerCase());
export const Read = () =>
  accumulatePermissions(PERMISSION_KEY, Actions.READ.toLocaleLowerCase());
export const Update = () =>
  accumulatePermissions(PERMISSION_KEY, Actions.UPDATE.toLocaleLowerCase());
export const Delete = () =>
  accumulatePermissions(PERMISSION_KEY, Actions.DELETE.toLocaleLowerCase());
