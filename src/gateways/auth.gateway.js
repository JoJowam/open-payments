import axios from 'axios';
import fs from 'fs';
import https from 'https';

export default class AuthGateway {
  constructor({ authUrl, clientId, clientSecret, logger }) {
    this.authUrl = authUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.logger = logger;
    this.token = null;
    this.expiresAt = null;
  }

  async getToken() {
    if (this.isTokenValid()) {
      this.logger.info('[AuthGateway] Token atual ainda é válido, reutilizando.');
      return this.token;
    }

    try {
      const tokenData = await this.fetchNewToken();
      this.updateToken(tokenData.access_token, tokenData.expires_in);
      return tokenData.access_token;
    } catch (error) {
      this.logger.error('[AuthGateway] Falha ao obter novo token.', error.response);
      this.logger.error('Erro detalhado:', error.response?.data || error.message);
      throw new Error('Falha de autenticação');
    }
  }

  isTokenValid() {
    const now = Date.now();
    const valid = this.token && now < this.expiresAt - 60000;
    this.logger.debug(
      `[AuthGateway] isTokenValid? ${valid} (agora: ${now}, expiraEm: ${this.expiresAt})`
    );
    return valid;
  }

  async fetchNewToken() {
    const certificate = fs.readFileSync('./src/config/certs/OpenPayments.p12');
    const httpsAgent = new https.Agent({
      pfx: certificate,
      passphrase: process.env.CERT_PASSPHRASE || '',
    });

    const payload = { grant_type: 'client_credentials' };
    const headers = this.buildHeaders();
    const config = { headers, httpsAgent };
    const response = await axios.post(this.authUrl, payload, config);

    return response.data;
  }

  buildHeaders() {
    const credentials = `${this.clientId}:${this.clientSecret}`;
    const basicAuth = Buffer.from(credentials).toString('base64');
    return {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    };
  }

  updateToken(accessToken, expiresIn) {
    this.token = accessToken;
    this.expiresAt = Date.now() + expiresIn * 1000;
    this.logger.info(
      `[AuthGateway] Novo token válido por ${expiresIn} segundos (até ${new Date(this.expiresAt).toISOString()})`
    );
  }
}
