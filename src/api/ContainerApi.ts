import { accountApi } from 'thunks';
import { CreateContainerForm } from 'handlers/createContainerForm';
import { PDFParams } from 'pages/MainMonitorPage/steps/Reporting/Reporting';

import Api, { FetchMethodType } from './Api';

export interface ObserverOptions {
  emails: string[];
  onDestroy: boolean;
  onDie: boolean;
  onKill: boolean;
  onStart: boolean;
  onStop: boolean;
  onRestart: boolean;
  isOn: boolean;
}

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

  public async executeCommandContainer(user: any, containerId: string, cmd: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/container/exec`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containerId: containerId, cmd: cmd },
    });
  }

  public async getPDFsDataContainers(user: any, containersId: Array<string>, pdfParams: PDFParams, lang: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/pdf`, {
      headers: headers,
      method: FetchMethodType.POST,
      body: { containersId: containersId, pdfParams: pdfParams, lang: lang },
    });
  }

  public async updateObserverSettings(user: any, containerId: string, options: ObserverOptions) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/containers/observers`, {
      headers: headers,
      method: FetchMethodType.PUT,
      body: { containerId: containerId, options },
    });
  }

  public async getObserverSettings(user: any, containerId: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    headers.set('containerId', containerId);
    return this.fetch(`/containers/observer`, {
      headers: headers,
      method: FetchMethodType.GET,
    });
  }
}
