import { accountApi } from 'thunks';
import { CreateContainerForm } from 'handlers/createContainerForm';

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
  public async createContainer(user: any, containerOptions: CreateContainerForm) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers`, {
      headers: headers,
      method: FetchMethodType.PUT,
      body: containerOptions,
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

  public async deleteContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers`, {
      headers: headers,
      method: FetchMethodType.DELETE,
      body: { containersId: containersId },
    });
  }

  public async restartContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/restart`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId },
    });
  }

  public async pauseContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/pause`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId },
    });
  }

  public async unpauseContainers(user: any, containersId: Array<any>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/unpause`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId },
    });
  }

  public async getContainerData(user: any, containerId: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/container/?containerID=${containerId}`, {
      headers: headers,
    });
  }

  public async getContainerLogs(user: any, containerId: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/container/logs/?containerID=${containerId}`, {
      headers: headers,
    });
  }
}
