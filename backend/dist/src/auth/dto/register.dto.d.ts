import { Role } from '../../generated/prisma/client.js';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}
