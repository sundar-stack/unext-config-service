/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiConfigModel } from '../models/ApiConfig';
import { provideSingleton } from '../ioc/ioc';
import { ErrUtils, ProviderFactory } from '@edunxtv2/service-util';
import { BaseService } from './Base';
import { OrgConfigsModel } from '../models/OrgConfigs';
import { ProductConfigsModel } from '../models/ProductConfigs';
import { Utils } from '../utils/Utils';
import { Constants } from '../constants/Constants';

@provideSingleton(DomainConfigurationService)
export class DomainConfigurationService extends BaseService {
  private configservice_url: string;
  protected getEntityName(): string {
    throw new Error('Method not implemented.');
  }
  protected getIdFieldName(): string {
    throw new Error('Method not implemented.');
  }

  constructor() {
    super();
    const attributesProvider = ProviderFactory.getAttribsProvider();
    this.configservice_url = attributesProvider.getConfigVar("IMAGE_CONTENT_BASE_URL");
  }

  protected getModel(): typeof ApiConfigModel {
    return ApiConfigModel;
  }

  protected getChildModel(): typeof ApiConfigModel {
    return ApiConfigModel;
  }

  public async clearAll(): Promise<void> {
    await ApiConfigModel.deleteMany({}).session(this.getSession());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async createApiConfiguration(domain: string, apiBaseUrl: string, orgId: string) {
    return await new ApiConfigModel({ domain, apiBaseUrl, orgId }).save({ session: this.getSession() });
  }

  public async updateLoginPageConfiguration(updateParams: any): Promise<void> {
    await OrgConfigsModel.collection.bulkWrite([
      this.createBulkWriteEntry(updateParams.orgId, updateParams.headerText, "loginPage", "headerText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.welcomeText, "loginPage", "welcomeText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.ssoText, "loginPage", "ssoText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.supportText, "loginPage", "supportText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.logoRedirectUrl, "loginPage", "logoRedirectUrl"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.apiBaseUrl, "application", "apiBaseUrl"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.poweredByUnextLogo, "loginPage", "poweredByUnextLogo"),
    ]);
  }

  public async updateCommonLoginPageConfiguration(updateParams: any): Promise<void> {
    const bulkWriteParams = [
      this.createBulkWriteEntry(updateParams.orgId, updateParams.headerText, "commonLoginPage", "headerText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.logoClickUrl, "commonLoginPage", "logoClickUrl"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.welcomeText, "commonLoginPage", "welcomeText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.learnerLoginText, "commonLoginPage", "learnerLoginText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.learnerLoginUrl, "commonLoginPage", "learnerLoginUrl"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.nonLearnerLoginText, "commonLoginPage", "nonLearnerLoginText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.nonLearnerLoginUrl, "commonLoginPage", "nonLearnerLoginUrl"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.copyright, "commonLoginPage", "copyright"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.isTermsAndCondition, "commonLoginPage", "isTermsAndCondition"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.isPrivacyPolicy, "commonLoginPage", "isPrivacyPolicy"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.poweredByUnextLogo, "commonLoginPage", "poweredByUnextLogo"),
    ];
    if(updateParams.isTermsAndCondition && updateParams.isTermsAndCondition.toString() === 'true') {
      bulkWriteParams.push(this.createBulkWriteEntry(updateParams.orgId, updateParams.termsAndConditionText, "commonLoginPage", "termsAndConditionText"));
    }
    if(updateParams.isPrivacyPolicy && updateParams.isPrivacyPolicy.toString() === 'true') {
      bulkWriteParams.push(this.createBulkWriteEntry(updateParams.orgId, updateParams.privacyPolicyText, "commonLoginPage", "privacyPolicyText"));
    }
    await OrgConfigsModel.collection.bulkWrite(bulkWriteParams);
  }

  public async updateIndividualLoginPageConfiguration(updateParams: any): Promise<void> {
    const bulkWriteParams = [
      this.createBulkWriteEntry(updateParams.orgId, updateParams.headerText, "individualLoginPage", "headerText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.logoClickUrl, "individualLoginPage", "logoClickUrl"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.welcomeText, "individualLoginPage", "welcomeText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.learnerLoginPersona, "individualLoginPage", "learnerLoginPersona"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.nonLearnerLoginPersona, "individualLoginPage", "nonLearnerLoginPersona"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.supportText, "individualLoginPage", "supportText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.copyright, "individualLoginPage", "copyright"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.isTermsAndCondition, "individualLoginPage", "isTermsAndCondition"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.isPrivacyPolicy, "individualLoginPage", "isPrivacyPolicy"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.termsAndConditionText, "individualLoginPage", "termsAndConditionText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.privacyPolicyText, "individualLoginPage", "privacyPolicyText"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.poweredByUnextLogo, "individualLoginPage", "poweredByUnextLogo"),
    ];
    if(updateParams.nonLearnerLoginPersona === 'sso') {
      this.createBulkWriteEntry(updateParams.orgId, updateParams.ssoText, "individualLoginPage", "ssoText");
    }
    if(updateParams.isTermsAndCondition && updateParams.isTermsAndCondition.toString() === 'true') {
      bulkWriteParams.push(this.createBulkWriteEntry(updateParams.orgId, updateParams.termsAndConditionText, "individualLoginPage", "termsAndConditionText"));
    }
    if(updateParams.isPrivacyPolicy && updateParams.isPrivacyPolicy.toString() === 'true') {
      bulkWriteParams.push(this.createBulkWriteEntry(updateParams.orgId, updateParams.privacyPolicyText, "individualLoginPage", "privacyPolicyText"));
    }
    await OrgConfigsModel.collection.bulkWrite(bulkWriteParams);
  }

  public async updateBrandingPage(updateParams: any): Promise<void> {
    await OrgConfigsModel.collection.bulkWrite([
      this.createBulkWriteEntry(updateParams.orgId, updateParams.bannerType, 'brandingPage', 'bannerType'),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.headerText, 'brandingPage', 'headerText'),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.greetingsText, 'brandingPage', 'greetingsText'),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.announcementMessage, 'brandingPage', 'announcementMessage'),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.announcementStatus, 'brandingPage', 'announcementStatus'),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.screenDuration, 'brandingPage', 'screenDuration'),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.poweredByUnextLogo, 'brandingPage', 'poweredByUnextLogo'),
    ]);
  }

  public async updateImageContent(updateParams: any): Promise<void> {
    await OrgConfigsModel.collection.bulkWrite([
      this.createBulkWriteEntry(updateParams.orgId, updateParams.value, updateParams.context, updateParams.attribName + "Content"),
      this.createBulkWriteEntry(updateParams.orgId, updateParams.hash, 'generic', updateParams.attribName + "Hash"),
      this.createBulkWriteEntry(updateParams.orgId, `/domainconfiguration/imagecontent/${updateParams.attribName}Content?orgId=${updateParams.orgId}&hash=${updateParams.hash}`, updateParams.uriContext, updateParams.attribName + "_URL"),
    ]);
  }

  public async updateApiConfiguration(domain: string, apiBaseUrl: string, orgId: string): Promise<void> {
    try {
      await ApiConfigModel.findOneAndUpdate(
        { apiBaseUrl, orgId },
        { $set: { configId: Utils.generateUuid(), domain, apiBaseUrl, orgId } },
        { upsert: true, new: true }
      );
    } catch (err) {
      ErrUtils.throwValidationError(Constants.UPDATE_ENTITY_ERR, Constants.UPDATE_ENTITY);
    }
  }

  public async updateProductConfiguration(context: string, attribName: string, value: string): Promise<void> {
    try {
      await ProductConfigsModel.findOneAndUpdate(
        { context, attribName },
        { $set: { productConfigId: Utils.generateUuid(), context, attribName, value } },
        { upsert: true, new: true }
      );
    } catch (err) {
      ErrUtils.throwValidationError(Constants.UPDATE_ENTITY_ERR, Constants.UPDATE_ENTITY);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public createBulkWriteEntry(orgId: string, value: string, context: string, attribName: string) {
    return {
      'updateOne': {
        'filter': { orgId, attribName },
        'update': { '$set': { orgConfigId: Utils.generateUuid(), orgId, context, attribName, value } },
        'upsert': true,
        'new': true,
        'ordered': false
      }
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async findOne(query, fieldsToProject = {}): Promise<any> {
    return await super.findOne(query, fieldsToProject);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async fetchOrgsConfig(query) {
    return await OrgConfigsModel.find(query).session(this.getSession());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async fetchProductConfig(query) {
    return await ProductConfigsModel.find(query).session(this.getSession());
  }

  public async deleteImageAndHash(orgId, imageContent): Promise<void> {
    await OrgConfigsModel.deleteMany({ $or: [{ orgId, attribName: `${imageContent}Hash` }, { orgId, attribName: `${imageContent}Content` }, { orgId, attribName: `${imageContent}_URL` }] }).session(this.getSession());
  }
}
