import { WEBHOOK_TYPES } from '#shared/constants';
import { IsValidUrl } from '#shared/utils';

export default class CreateConfigurationInteractor {
  constructor({ configurationGateway }) {
    this.gateway = configurationGateway;
  }

  async execute(input) {
    this.validateCreateConfigurationInput(input);
    const result = await this.gateway.create(input);

    return result;
  }

  validateCreateConfigurationInput(input) {
    const { redirectURL, webhookURL, webhookSecurity } = input;

    if (redirectURL && IsValidUrl(redirectURL)) {
      throw new Error('redirectURL não é uma URL válida.');
    }

    if (webhookURL && IsValidUrl(webhookURL)) {
      throw new Error('webhookURL não é uma URL válida.');
    }

    if (webhookSecurity) {
      const { type, hash } = webhookSecurity;
      if (webhookSecurity.type.trim() === '') {
        throw new Error('webhookSecurity.type deve ser uma string não vazia.');
      }

      if (!Object.values(WEBHOOK_TYPES).includes(type)) {
        throw new Error('webhookSecurity.type inválido, deve ser "hmac" ou "mtls".');
      }

      if (type == WEBHOOK_TYPES.HMAC && !hash) {
        throw new Error("O campo hash é obrigatorio em configurações do tipo 'hmac'");
      }
    }
  }
}
