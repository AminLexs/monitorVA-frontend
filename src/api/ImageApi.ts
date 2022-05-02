interface AuthenticateCreds {
  email: string;
  password: string;
}

export default class ImageApi {
  public async Authenticate({ email, password }: AuthenticateCreds) {}
}
