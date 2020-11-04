export default class AuthUserModel {
  uid: string;
  isAnonymous: boolean;
  name?: string;
  email?: string;

  constructor(data: any) {
    if (!data || !data.user_id) {
      return;
    }

    this.uid = data.user_id;
    this.isAnonymous = data?.firebase?.sign_in_provider === 'anonymous';
    this.name = data.name;
    this.email = data.email;
  }
}
