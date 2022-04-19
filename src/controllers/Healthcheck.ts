import { Request, Response } from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { Constants } from '../constants/Constants';
import { DomainConfigurationService } from '../services/DomainConfiguration';
import { inject } from 'inversify';
import { BaseController } from './Base';

@controller(`${Constants.CONTEXT_PATH}/healthcheck`)
export class HealthCheckController extends BaseController {

  constructor(@inject(DomainConfigurationService) private domainConfigurationService: DomainConfigurationService) {
    super();
  }

  @httpGet('/')
  public async checkHealth(req: Request, res: Response): Promise<void> {
    await this.domainConfigurationService.findOne({ "domain": "SomeRandomIdWhichWillNotYieldResults" });
    res.send("success");
  }

  @httpGet('/nodb')
  public async checkHealthNoDb(req: Request, res: Response): Promise<void> {
    res.send("success");
  }
}
