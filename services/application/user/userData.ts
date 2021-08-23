import { UserItem } from '~/domain/models/user/user'


export class UserDTO {
  id: number;
  username: string;
  is_superuser: boolean;

  constructor(item: UserItem) {
    this.id = item.id;
    this.username = item.username;
    this.is_superuser = item.is_superuser;
  }
}
