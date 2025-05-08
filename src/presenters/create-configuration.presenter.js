export default class CreateConfigurationPresenter {
  static present(response) {
    return {
      configId: response.id,
      status: response.status,
      createdAt: response.createdAt,
    };
  }
}
