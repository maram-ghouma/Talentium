import { UserRole } from "./user/entities/user.entity";
import { UserService } from "./user/user.service";
import * as bcrypt from 'bcrypt';

export async function seedAdmin(userService: UserService) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
  
    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment');
    }
  
    const existingAdmin = await userService.findByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await userService.create({
        email: adminEmail,
        password: hashedPassword,
        username: 'admin',
        currentRole: UserRole.ADMIN,
      });
      console.log('✅ Admin seeded.');
    }
  }
  