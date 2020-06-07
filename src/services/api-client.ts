type httpMethod = "GET" | "POST" | "PUT";

export interface Config {
  baseUrl: string;
  headers?: Headers;
}

export interface Headers {
  [header: string]: string;
}

interface ResponseJSON {
  [prop: string]: any;
}

class APIClient {
  constructor(public config: Config) {
  }

  async get(path: string) {
    return this.request("GET", path);
  }

  async post(path: string, data = {}) {
    return this.request("POST", path, data);
  }

  async put(path: string, data = {}) {
    return this.request("PUT", path, data);
  }

  async request(
    method: httpMethod,
    path: string,
    data = {},
  ): Promise<ResponseJSON> {
    const { baseUrl, headers } = this.config;
    const url = new URL(path, baseUrl);
    const request = new Request(url.href, {
      method,
      headers,
      body: JSON.stringify(data),
    });
    const response = await fetch(request);
    if (response.status > 299) {
      throw response as Response;
    }
    return response.json() as ResponseJSON;
  }
}

export default APIClient;
