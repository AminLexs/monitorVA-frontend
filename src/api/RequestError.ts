export default class RequestError extends Error {
  constructor(message: string, readonly responseStatus: number) {
    super(message);
  }
}
