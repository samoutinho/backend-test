import { DataSource } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@thera.com',
      password: await bcrypt.hash('admin123', 10),
    },
    {
      name: 'Test User',
      email: 'test@thera.com',
      password: await bcrypt.hash('test123', 10),
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Usuário criado: ${userData.email}`);
    } else {
      console.log(`Usuário já existe: ${userData.email}`);
    }
  }
}

