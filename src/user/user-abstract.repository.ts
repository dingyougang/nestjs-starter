export abstract class UserAbstractRepository {
  abstract find(username: string): Promise<any[]>;
  abstract findOne(id: number): Promise<any>;
  abstract create(userObj: any): Promise<any>;
  abstract update(userObj: any): Promise<any>;
  abstract delete(id: number): Promise<any>;
}
