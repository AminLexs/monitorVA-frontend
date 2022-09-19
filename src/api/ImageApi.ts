import { accountApi, API_URL } from 'thunks';

import Api, { FetchMethodType } from './Api';

export default class ImageApi extends Api {
  public async uploadArchiveImage(user: any, formData: FormData, imageName: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    headers.set('imageName', imageName);

    return (
      await fetch(`${API_URL}/images`, {
        method: 'POST',
        body: formData,
        headers: headers,
      })
    ).json();
  }

  public async getImages(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);

    return this.fetch(`/images`, {
      headers: headers,
    });
  }

  public async deleteImages(user: any, imagesId: Array<string>) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);

    return this.fetch(`/images`, {
      headers: headers,
      method: FetchMethodType.DELETE,
      body: { imagesId: imagesId },
    });
  }

  public async checkImageName(user: any, imageName: string) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    headers.set('imageName', imageName);

    return this.fetch(`/images/checkname`, {
      headers: headers,
      method: FetchMethodType.GET,
    });
  }
}
