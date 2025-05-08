import { CONFIGURATION_ROUTES } from '#shared/constants';

export default class ConfigurationGateway {
  constructor({ requestGateway }) {
    this.requestGateway = requestGateway;
  }

  async create(payload) {
    try {
      const { data } = await this.requestGateway.put(CONFIGURATION_ROUTES.Create, payload);
      return data;
    } catch (error) {
      throw new Error(`Failed to create configuration: ${error.message}`);
    }
  }

  async get(payload) {
    try {
      const { data } = await this.requestGateway.get(CONFIGURATION_ROUTES.get, payload);
      return data;
    } catch (error) {
      throw new Error(`Failed to get configuration: ${error.message}`);
    }
  }
}
