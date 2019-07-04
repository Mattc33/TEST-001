import { 
    PermissionKind,
    BasePermissions
} from '@pnp/sp';
import { IPermissionMask } from '../../models';

export class Permissions {

    public static getBasePermission(permHex: string) {

        const basePerm: BasePermissions = {
            Low: this.getPermMaskL(permHex),
            High: this.getPermMaskH(permHex)
        };
        return basePerm;

    }

    public static getPermissionMaskFromObject(perms: BasePermissions): IPermissionMask {

        let permMask: IPermissionMask = {
            create: false,
            update: false,
            delete: false,
            view: true
        };

        if(!perms) return permMask;

        if(this.hasPermissions(perms, PermissionKind.AddListItems))
            permMask.create = true;

        if(this.hasPermissions(perms, PermissionKind.EditListItems))
            permMask.update = true;

        if(this.hasPermissions(perms, PermissionKind.DeleteListItems))
            permMask.delete = true;

        return permMask;

    }

    public static getPermMaskH(b) {

        const a = b.length;
        return a <= 10 ? 0 : parseInt(b.substring(2, a - 8), 16);

    }
     
    public static getPermMaskL(b) {

        const a = b.length;
        return a <= 10 ? parseInt(b) : parseInt(b.substring(a - 8, a), 16);

    }

    public static hasPermissions(value: BasePermissions, perm: PermissionKind): boolean {

        if (!perm) {
            return true;
        }

        const low = value.Low;
        const high = value.High;

        if (perm === PermissionKind.FullMask) {
            return (high & 32767) === 32767 && low === 65535;
        }

        perm = perm - 1;
        let num = 1;

        if (perm >= 0 && perm < 32) {
            num = num << perm;
            return 0 !== (low & num);
        } else if (perm >= 32 && perm < 64) {
            num = num << perm - 32;
            return 0 !== (high & num);
        }
        return false;
        
    } 

}