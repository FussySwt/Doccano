export class MemberItem {
  constructor(
    public id: number,
    public user: number,
    public role: number,
    public username: string,
    public rolename: string,
    public is_superuser: boolean
  ) {}

  static valueOf(
    { id, user, role, username, rolename, is_superuser }:
    { id: number, user: number, role: number, username: string, rolename: string, is_superuser: boolean }
  ): MemberItem {
    return new MemberItem(id, user, role, username, rolename, is_superuser)
  }

  toObject(): Object {
    return {
      id: this.id,
      user: this.user,
      role: this.role,
      username: this.username,
      rolename: this.rolename,
      is_superuser: this.is_superuser
    }
  }
}
