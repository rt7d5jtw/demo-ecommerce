import { PipeTransform } from '@nestjs/common';
import { UserRole } from '../user.entity';
export declare class UserRoleValidationPipe implements PipeTransform {
    readonly allowedRoles: UserRole[];
    transform(value: any): any;
    private isRoleValid;
}
