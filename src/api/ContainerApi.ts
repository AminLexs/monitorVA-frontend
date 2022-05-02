interface AuthenticateCreds {
  email: string;
  password: string;
}

export default class ContainerApi {
  public async Authenticate({ email, password }: AuthenticateCreds) {}
}
