import { accountApi } from 'thunks';

import Api, { FetchMethodType } from './Api';
import { Role } from 'enums/Role';

export default class AdminApi extends Api {
  public async GetUsers(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/users`, {
      headers: headers,
      method: FetchMethodType.GET,
    });
  }
  public async ChangeUserRole(user: any, uid: string, role: Role) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/user`, {
      headers: headers,
      method: FetchMethodType.PUT,
      body: {
        uid: uid,
        role: role,
      },
    });
  }

  public async CreateUser(user: any, email: string, password: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/user`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: {
        email: email,
        password: password,
      },
    });
  }

  public async DeleteUser(user: any, uid: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/user`, {
      headers: headers,
      method: FetchMethodType.DELETE,
      body: {
        uid: uid,
      },
    });
  }

  public async GetRole(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/user/role`, {
      headers: headers,
      method: FetchMethodType.GET,
    });
  }
}
