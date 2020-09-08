export class AuthUserModel {
  name: string;
  email: string;

  constructor(data: any) {
    if (!data || !data.name || !data.email) {
      return;
    }

    this.name = data.name;
    this.email = data.email;
  }
}
