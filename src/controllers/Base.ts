import { injectable } from "inversify";
import { Request } from "express";
import { ValidationUtils, ErrUtils, TransactionManagerFactory, OrmOdms, ProviderFactory } from "@edunxtv2/service-util";
import { SortOption, QueryCriteria } from '../interfaces/QueryCriteria';
import { Constants } from "../constants/Constants";
import { IKalturaConfigurations } from "../interfaces/Interfaces";

@injectable()
export abstract class BaseController {
  private configservice_url: string;
  constructor() {
    const attributesProvider = ProviderFactory.getAttribsProvider();
    this.configservice_url = attributesProvider.getConfigVar("IMAGE_CONTENT_BASE_URL");
  }
  updatedParams = [
    "brandingBannerVerticalImage_URL",
    "loginBannerImage_URL",
    "commonLoginBannerImage_URL",
    "individualLoginBannerImage_URL",
    "individualLearnerLoginBannerImage_URL",
    "brandingBannerHorizontalImage_URL",
    "brandingBannerHorizontalSplitImage_URL",
    "logoImage_URL",
    "commonLogoImage_URL",
    "individualLogoImage_URL",
  ];

  protected async commitTransaction(): Promise<void> {
    await TransactionManagerFactory.getInstance(OrmOdms.MONGOOSE).commit();
  }

  protected determineLimit(req: Request): number {
    return this.convertToPositiveInt("limit", req, 20, false);
  }

  protected determineSkip(req: Request): number {
    return this.convertToPositiveInt("skip", req, 0, true);
  }

  public convertToBinary(base64data: any): string {
    return Buffer.from(base64data, 'base64').toString('binary');
  }

  protected determineSortOptions(req: Request): SortOption[] {
    const sortOptionStr: string = req.query.sort as string;

    if (!sortOptionStr || sortOptionStr.trim().length === 0) {
      return undefined;
    }

    const sortOptions: string[] = sortOptionStr.split(":");
    let sortKey: string;
    let sortOrder = 1;

    if (sortOptions.length === 1) {
      sortKey = sortOptionStr.trim();
    } else {
      sortKey = sortOptions[0].trim();
      const sortOrderStr = sortOptions[1].trim().toLowerCase();

      if (sortOrderStr === "desc" || sortOrderStr === "descending") {
        sortOrder = -1;
      }
    }

    return [{
      sortKey: sortKey,
      sortOrder: sortOrder
    }];
  }

  protected createDefaultQueryCriteria(req: Request): QueryCriteria {
    const filter: { [s: string]: string } = {};

    for (const key of Object.keys(req.query)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const value = req.query[key].trim();

      if (value.length > 0 && (key !== "fields" && key !== "sort" && key !== "limit" && key !== "skip")) {
        filter[key] = value;
      }
    }

    return {
      filter: filter,
      fields: this.determineFields(req),
      sortOptions: this.determineSortOptions(req),
      skip: this.determineSkip(req),
      limit: this.determineLimit(req)
    };
  }

  private determineFields(req) {
    const fieldsStr = req.query.fields;

    if (!fieldsStr || fieldsStr.length === 0) {
      return [];
    }

    let fields: string[];

    try {
      fields = fieldsStr.split(',');
    } catch (err) {
      ErrUtils.throwValidationError(`Invalid value ${fieldsStr} provided for fields parameter`, "INVALID_FIELDS_PARAMETER_VALUE");
    }

    ValidationUtils.validateArrayNotEmpty(fields, "req.query.fields");

    return fields;
  }

  private convertToPositiveInt(attribName: string, req: Request, defaultNum: number, zeroAllowed: boolean) {

    const numStr: string = req.query[attribName] as string;

    if (numStr && numStr.trim().length > 0) {
      const num = parseInt(numStr);

      if (isNaN(num) || num < 0) {
        ErrUtils.throwValidationError(`The value specified for ${attribName} (${numStr}) is not a valid positive integer`,
          "NOT_VALID_NUMBER");
      }

      if (!zeroAllowed && num === 0) {
        ErrUtils.throwValidationError(`The value specified for ${attribName} (${numStr}) cannot be zero`,
          "NOT_POSITIVE_NUMBER");
      }

      return num;
    }
    return defaultNum;
  }

  protected clearAllValidation(): void {
    this.validateApiEnabled("CLEAR_ALL_ENABLED");
  }

  protected validateApiEnabled(configVar: string): void {
    const createConfigurationEnabled = ProviderFactory.getAttribsProvider().getConfigVar(configVar);
    if (createConfigurationEnabled && createConfigurationEnabled.trim().toLowerCase() !== "true") {
      ErrUtils.throwValidationError(`The Configuration Variable ${configVar} is not enabled`, Constants.CONFIG_VAR_NOT_ENABLED);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public formatConfigData(configs: any): void {
    configs.configuration.forEach(element => {
      configs['configuration'] = JSON.parse(element);
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public formatProductConfig(productconfigs: any) {
    const productConfig = {};
    productconfigs.forEach(element => {
      if (this.updatedParams.includes(element.attribName)) {
        productConfig[element.attribName] = { value: `${this.configservice_url}${element.value}`, default: true };
      } else {
        productConfig[element.attribName] = element.value;
      }
    });
    return productConfig;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public formatOrgConfig(orgconfigs: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgConfig: any = {};
    orgconfigs.forEach(element => {
      if (this.updatedParams.includes(element.attribName)) {
        orgConfig[element.attribName] = { value: `${this.configservice_url}${element.value}`, default: false };
      } else {
        orgConfig[element.attribName] = element.value;
      }
    });
    return orgConfig;
  }

  public getKalturaConfigurations(): IKalturaConfigurations {
    const attributesProvider = ProviderFactory.getAttribsProvider()
    const secretsProvider = ProviderFactory.getSecretsProvider()
    const kalturaServiceUrl: string = attributesProvider.getConfigVar("KALTURA_SERVICE_URL");
    const kalturaPartnerId: number = parseInt(secretsProvider.getSecret("KALTURA_PARTNER_ID"));
    const kalturaSubPartnerId: number = parseInt(secretsProvider.getSecret("KALTURA_SUB_PARTNER_ID"));
    const kalturaUiConfigId: number = parseInt(attributesProvider.getConfigVar("KALTURA_UI_CONFIG_ID"));
    const kalturaPlayerSourceUrl: string = `${kalturaServiceUrl}/p/${kalturaPartnerId}/sp/${kalturaSubPartnerId}/embedIframeJs/uiconf_id/${kalturaUiConfigId}/partner_id/${kalturaPartnerId}`;
    const kalturaConfigurations: IKalturaConfigurations = {
      kalturaAdminSecret: secretsProvider.getSecret("KALTURA_ADMIN_SECRET"),
      kalturaUserSecret: secretsProvider.getSecret("KALTURA_USER_SECRET"),
      kalturaPartnerId,
      kalturaSubPartnerId,
      kalturaUiConfigId,
      kalturaAppHost: attributesProvider.getConfigVar("KALTURA_APP_HOST"),
      kalturaCuePointUrl: attributesProvider.getConfigVar("KALTURA_CUE_POINT_URL"),
      kalturaServiceUrl,
      kalturaEndPointUrl: attributesProvider.getConfigVar("KALTURA_ENDPOINT_URL"),
      kalturaPrivilegesForSelfCapture: attributesProvider.getConfigVar("KALTURA_PRIVILEGES_FOR_SELF_CAPTURE"),
      kalturaPrivilegesForOptions: attributesProvider.getConfigVar("KALTURA_PRIVILEGES_FOR_OPTIONS"),
      kalturaVideoEditorSource: attributesProvider.getConfigVar("KALTURA_VIDEO_EDITOR_SOURCE"),
      kalturaStatsSource: attributesProvider.getConfigVar("KALTURA_STATS_SOURCE"),
      kalturaPlayerSourceUrl,
      kalturaVideoOptionsUrl: attributesProvider.getConfigVar("KALTURA_VIDEO_OPTIONS_URL")
    }
    return kalturaConfigurations;
  }
}
