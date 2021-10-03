"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    async fetch(searchUserDto) {
        const { role, search } = searchUserDto;
        const query = this.createQueryBuilder('user');
        if (role) {
            query.andWhere('user.role = :role', { role });
        }
        if (search) {
            query.andWhere('(user.email LIKE :search)', { search: `%${search}%` });
        }
        const users = await query.getMany();
        return users;
    }
    async createUser(createUserDto) {
        const { password, email } = createUserDto;
        const user = this.create();
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.email = email;
        user.role = user_entity_1.UserRole.USER;
        try {
            await user.save();
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Email already exists');
            }
            else if (error.code === '23505') {
                throw new common_1.InternalServerErrorException();
            }
        }
        return user;
    }
    async updateEmail(user, email) {
        user.email = email['email'];
        await user.save();
        return user.email;
    }
    async changePassword(user, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        if (user && (await user.validatePassword(currentPassword))) {
            if (newPassword === currentPassword)
                throw new common_1.ConflictException("You're already using this password");
            user.salt = await bcrypt.genSalt();
            user.password = await this.hashPassword(newPassword, user.salt);
            await user.save();
        }
        else {
            throw new common_1.UnauthorizedException(`Invalid credentials`);
        }
        return user.password;
    }
    async changeEmail(user, changeEmailDto) {
        const { currentEmail, newEmail } = changeEmailDto;
        if (user.email === newEmail)
            throw new common_1.ConflictException(`Email is already in use`);
        if (user.email === currentEmail) {
            user.email = newEmail;
            user.save();
        }
        else {
            throw new common_1.ConflictException('Wrong email provided');
        }
        return user.email;
    }
    async validateUserPassword(loginDto) {
        const { email, password } = loginDto;
        const user = await this.findOne({ email });
        if (user && (await user.validatePassword(password))) {
            return user.email;
        }
        else {
            return null;
        }
    }
    async hashPassword(password, salt) {
        return bcrypt.hash(password, salt);
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(user_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map