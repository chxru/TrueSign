import axios, { AxiosRequestConfig } from 'axios';

export class Fetcher {
  private static axios = axios.create({
    baseURL: '/api',
  });

  /**
   * Update the axios instance with latest token
   * @param token new access token
   */
  public static setToken(token: string) {
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Send get request to the API
   */
  public static get<T>(url: string, config?: AxiosRequestConfig) {
    this.axios.get<T>(url, config).then((res) => res.data);
  }

  /**
   * Send post request to the API
   */
  public static post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return this.axios.post<T>(url, data, config).then((res) => res.data);
  }

  /**
   * Send put request to the API
   */
  public static put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return this.axios.put<T>(url, data, config).then((res) => res.data);
  }

  /**
   * Send delete request to the API
   */
  public static delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete<T>(url, config).then((res) => res.data);
  }
}
