export interface UserAdapter {
  create(userObj: any): Promise<any>;
  delete(id: number): Promise<any>;
  find(): Promise<any[]>;
  findOne(id: number): Promise<any>;
  update(userObj: any): Promise<any>;
}
