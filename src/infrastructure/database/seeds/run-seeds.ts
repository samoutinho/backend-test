import { AppDataSource } from '../data-source';
import { seedProducts } from './product.seed';
import { seedUsers } from './user.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    await seedUsers(AppDataSource);
    await seedProducts(AppDataSource);

    console.log('Seeds executados com sucesso!');
  } catch (error) {
    console.error('Error during seeds execution:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();

