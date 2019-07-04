export interface IPermissionMask {

    create: boolean;
    update: boolean;
    delete: boolean;
    view: boolean;

}

export const defaultPermission: IPermissionMask = {
    create: false,
    update: false,
    delete: false,
    view: true
};