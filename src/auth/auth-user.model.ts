export default class AuthUserModel {
  uid: string;
  name?: string;
  email?: string;

  constructor(data: any) {
    if (!data || !data.user_id) {
      return;
    }

    this.uid = data.user_id;
    this.name = data.name;
    this.email = data.email;
  }
}
