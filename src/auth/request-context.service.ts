
const requestContext = require('request-context'); // tslint:disable-line

export class RequestContextService {
  static get<T>(key: string): T {
    return requestContext.get(key);
  }

  static set(key: string, value: any): void {
    try {
      requestContext.set(key, value);
    } catch (err) {
      console.error('Error setting request context', err);
    }
  }
}
