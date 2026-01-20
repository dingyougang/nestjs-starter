import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
// import { UserAbstractRepository } from '../user-abstract.repository';
import { UserAdapter } from '../user.interface';
import { TYPEORM_DATABASE } from '@/database/database.constants';

export class UserTypeormRepository implements UserAdapter {
  constructor(
    @InjectRepository(User, TYPEORM_DATABASE)
    private userRepository: Repository<User>,
  ) {}
  find(): Promise<any[]> {
    return this.userRepository.find({});
  }
  findOne(id: number): Promise<any> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
  create(userObj: any): Promise<any> {
    return this.userRepository.save(userObj);
  }
  update(userObj: any): Promise<any> {
    return this.userRepository.update({ id: userObj.id }, userObj);
  }
  delete(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }
}
