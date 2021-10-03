"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user.entity");
class UserRoleValidationPipe {
    constructor() {
        this.allowedRoles = [user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.USER];
    }
    transform(value) {
        value = value.toUpperCase();
        if (!this.isRoleValid(value)) {
            throw new common_1.BadRequestException(`"${value}" is an invalid role`);
        }
        return value;
    }
    isRoleValid(role) {
        const idx = this.allowedRoles.indexOf(role);
        return idx !== -1;
    }
}
exports.UserRoleValidationPipe = UserRoleValidationPipe;
//# sourceMappingURL=user-role-validation.pipe.js.map