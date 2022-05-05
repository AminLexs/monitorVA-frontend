import { accountApi, API_URL } from 'thunks';

import Api from './Api';

export default class ImageApi extends Api {
  public async uploadArchiveImage(user: any, formData: FormData) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return fetch(`${API_URL}/images`, {
      method: 'POST',
      body: formData,
      headers: headers,
    });
  }

  public async getImages(user: any) {
    const token = await accountApi.GetToken(user);
    const headers = new Headers();
    headers.set('token', token);
    return this.fetch(`/images`, {
      headers: headers,
    });
  }
}
