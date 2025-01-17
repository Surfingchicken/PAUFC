import { DataSource } from "typeorm";
import { User } from "../database/entities/user";
import { AppDataSource } from "../database/database";
import { Err } from "joi";
import { Role } from "../database/entities/roles";
import { hash } from "bcrypt";
export interface listUserFilter{
    page: number,
    result: number
}
export interface UpdateUserParams {
  name?: string;
  email?: string;
  password?: string;
}


export class UserUsecase{
    constructor(private readonly db: DataSource) { }


    async getUserById(userId: number): Promise<User | null> {
      const userRepository = this.db.getRepository(User);
      const user = await userRepository.findOne({
          where: { id: userId }
      });
      return user;
  }
  
    async userList(listUserFilter: listUserFilter): Promise<{ user: User[] }> {
        const query = this.db.getRepository(User)
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.roles', 'role')  
          .take(listUserFilter.result)
          .skip((listUserFilter.page - 1) * listUserFilter.result);
    
        const listeUser = await query.getMany();
        return { user: listeUser };
      }

    async deleteUser(userId: number): Promise<void> {
        const userRepository = this.db.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        if (user) {
          await userRepository.remove(user);
        }
    }

    async updateUserRole(userId: number, roleId: number): Promise<User | null> {
        const userRepository = this.db.getRepository(User);
        const roleRepository = this.db.getRepository(Role);
    
        const user = await userRepository.findOneBy({ id: userId });
        const role = await roleRepository.findOneBy({ id: roleId });
    
        if (user && role) {
          user.roles = role;
          await userRepository.save(user);
          return user;
        }
        return null;
      }
      async update(userId: number, updateParams: UpdateUserParams): Promise<User | null> {
        const userRepository = this.db.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return null;
        }
        if (updateParams.password) {
          const hashedPassword = await hash(updateParams.password, 10);
          updateParams.password = hashedPassword;
      }

        Object.assign(user, updateParams);
        await userRepository.save(user);
        return user;
    }

    
}
