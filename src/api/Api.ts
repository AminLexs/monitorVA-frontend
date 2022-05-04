import RequestError from './RequestError';

export type AccessTokenGetter = () => Promise<string | null>;

interface IFetchResponse<T = any> extends Response {
  json<P = T>(): Promise<P>;
}

const TIMEOUT = 60000;

export interface IRequestErrors extends Error {
  response?: IFetchResponse;
}

export enum FetchMethodType {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface IFetchOptions {
  headers?: Headers;
  resetDefaultHeaders?: boolean;
  method?: FetchMethodType;
  body?: any;
  checkAuthorization?: boolean;
  statusChecker?: (res: Response) => Promise<IFetchResponse<Body>>;
}

const checkStatus = async (response: IFetchResponse): Promise<IFetchResponse> => {
  if (response.ok) {
    return response;
  }

  const body = await response.json();
  const errorMessage = body.message || body.data?.error || body.error?.message || response.statusText;

  throw new RequestError(errorMessage, response.status);
};

const getBasicHeaders = () => {
  const headers = new Headers();

  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  return headers;
};

export default class Api {
  constructor(private getAccessToken: AccessTokenGetter, private baseUrl?: string) {}

  protected async fetch<Body>(url: string, options?: IFetchOptions): Promise<Body> {
    const {
      headers: customHeaders,
      method = FetchMethodType.GET,
      body,
      checkAuthorization,
      resetDefaultHeaders,
      statusChecker = checkStatus,
    } = options || {};

    const headers = resetDefaultHeaders ? new Headers() : getBasicHeaders();
    const accessToken = checkAuthorization ? await this.getAccessToken() : null;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    if (customHeaders) {
      customHeaders.forEach((value: string, header: string) => {
        headers.set(header, value);
      });
    }

    const controller = new AbortController();
    setTimeout(() => controller.abort(), TIMEOUT);

    const userData = await fetch(this.baseUrl ? `${this.baseUrl}${url}` : url, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
      signal: controller.signal,
    });

    await statusChecker(userData);

    return userData.json();
  }
}
