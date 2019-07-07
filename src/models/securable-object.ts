import { IPermissionMask } from '.';

export interface ISecurableObject<T> {

    object: T;
    permissionMask: IPermissionMask;

}