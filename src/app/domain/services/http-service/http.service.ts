import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

export type verbs = 'PUT' | 'POST' | 'GET' | 'DELETE' | 'PATCH';

@Injectable({ providedIn: 'root' })
export class HttpService {
  readonly #baseApi: string = environment.BASE_API;
  constructor(protected _http: HttpClient) {}
  get(url: string, relative: boolean = true) {
    return this.request('GET', url, null, relative);
  }

  post<T = any>(url: string, params: T, relative: boolean = true) {
    return this.request('POST', url, params, relative);
  }

  put<T = any>(url: string, params: T, relative: boolean = true) {
    return this.request('PUT', url, params, relative);
  }

  delete<T = any>(url: string, param?: T, relative: boolean = true) {
    return this.request('DELETE', url, param, relative);
  }

  private request<T = any>(
    type: verbs,
    url: string,
    params?: T,
    relative: boolean = true
  ) {
    if (relative) {
      url = `${this.#baseApi}/${url}`;
    }
    switch (type) {
      case 'PUT':
        return this._http.put<T>(url, params);
      case 'POST':
        return this._http.post<T>(url, params);
      case 'GET':
        return this._http.get<T>(url);
      case 'DELETE':
        const option = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          body: params,
        };
        return this._http.delete<T>(url, option);
      case 'PATCH':
        return this._http.patch<T>(url, params);
      default:
        return this._http.get<T>(url);
    }
  }
}
