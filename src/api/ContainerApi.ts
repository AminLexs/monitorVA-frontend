import { accountApi } from 'thunks';

import Api, { FetchMethodType } from './Api';
// interface ContainerData {
//   name: string;
//   image: string;
//   status: number;
//   publicPort: number;
//   privatePort: string;
//   created: string;
//   Id: string;
// }

export default class ContainerApi extends Api {
  public async createContainer(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers`, {
      headers: headers,
      method: FetchMethodType.PUT,
    });
  }

  public async getContainers(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers`, {
      headers: headers,
    });
  }

  public async monitoringContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/monit`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId },
    });
  }

  public async startContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/start`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId },
    });
  }

  public async stopContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/stop`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId },
    });
  }
}
