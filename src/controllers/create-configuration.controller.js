export default class CreateConfigurationController {
  constructor({ createConfigurationInteractor, createConfigurationPresenter }) {
    this.interactor = createConfigurationInteractor;
    this.presenter = createConfigurationPresenter;
  }

  async handle(req, res) {
    try {
      const input = this.extractInteractorInput(req.body);
      const result = await this.interactor.execute(input);
      const viewModel = this.presenter.present(result);
      res.status(201).json(viewModel);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  extractInteractorInput(input) {
    return {
      redirectURL: input.redirectURL,
      webhookURL: input.webhookURL,
      webhookSecurity: {
        type: input.webhookSecurity.type,
        hash: input.webhookSecurity.hash ?? undefined,
      },
      processPayment: input.processPayment,
      generateTxIdForInic: input.generateTxIdForInic,
    };
  }
}
