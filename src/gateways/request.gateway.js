import axios from 'axios';
import fs from 'fs';
import https from 'https';

export default class RequestGateway {
  constructor({ authGateway, logger, baseURL }) {
    this.authGateway = authGateway;
    this.logger = logger;

    const certificate = fs.readFileSync('./src/config/certs/OpenPayments.p12');
    const httpsAgent = new https.Agent({
      keepAlive: true,
      pfx: certificate,
      passphrase: process.env.CERT_PASSPHRASE || '',
    });

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent,
    });

    this._setupInterceptors();
  }

  _setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      try {
        const token = await this.authGateway.getToken();
        config.headers.Authorization = `Bearer ${token}`;

        this.logger.debug('[Request ▶]', {
          method: config.method.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          headers: config.headers,
          params: config.params,
          body: config.data,
        });
        return config;
      } catch (error) {
        this.logger.error('[Auth Error]', error.message);
        throw error;
      }
    });

    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug('[Response ✔]', {
          url: response.config.url,
          status: response.status,
          duration: `${response.headers['request-duration-ms']}ms`,
          data: response.data,
        });
        return response;
      },
      (error) => {
        const { config, response } = error;
        this.logger.error('[Response ✖]', {
          url: config.url,
          status: response?.status,
          data: response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}
