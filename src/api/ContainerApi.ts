import Api, { FetchMethodType } from './Api';
import { app, auth } from './AccountApi';
import { getAuth } from 'firebase/auth';
import { accountApi } from '../thunks';

interface ContainerData {
  name: string;
  image: string;
  status: number;
  publicPort: number;
  privatePort: string;
  created: string;
  Id: string;
}

export default class ContainerApi extends Api {
  public async getContainers(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers`, {
      headers: headers,
    });
  }
}
