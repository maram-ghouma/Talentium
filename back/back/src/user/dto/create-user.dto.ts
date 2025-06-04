// src/user/dto/create-user.dto.ts

import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
username: string;
  email: string;
  password: string;
  role?: UserRole;
   phoneNumber: string;
    country: string;

}
