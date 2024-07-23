import { DataSource } from 'typeorm';
import { User } from '../database/entities/user';

export class ContributionUsecase {
  constructor(private db: DataSource) {}

  async updateContributionStatus(userId: number): Promise<void> {
    const userRepository = this.db.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error('User not found');
    }

    user.contribution = true;
    user.toUpdateOn = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); 

    await userRepository.save(user);
  }

  async setContributionStatusToZero(userId: number): Promise<void> {
    const userRepository = this.db.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error('User not found');
    }

    user.contribution = false;

    await userRepository.save(user);
  }
}
