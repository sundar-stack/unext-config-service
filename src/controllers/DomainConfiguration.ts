import { ErrUtils, ValidationUtils } from '@edunxtv2/service-util';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { Constants } from '../constants/Constants';
import Crypto = require("crypto");
import { BaseService } from '../services/Base';
import { DomainConfigurationService } from '../services/DomainConfiguration';
import { BaseController } from './Base';
import { Utils } from '../utils/Utils';
import { LearnerLoginPersona } from '../constants/LearnerLoginPersona';
import { NonLearnerLoginPersona } from '../constants/NonLearnerLoginPersona';

@controller(`${Constants.CONTEXT_PATH}/domainconfiguration`)
export class DomainConfigurationController extends BaseController {
  protected getService(): BaseService {
    throw new Error("Method not implemented.");
  }

  constructor(@inject(DomainConfigurationService) private domainConfigurationService: DomainConfigurationService) {
    super();
  }
  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/clearAll:
   *  delete:
   *    summary: Deletes all configurations
   *    tags: [Domain configuration]
   *    responses:
   *      200:
   *        description: Deletes all configurations
   *        content:
   *          appliction/json
   *
   */
  @httpDelete("/clearAll")
  public async clearAll(req: Request, res: Response): Promise<void> {
    this.clearAllValidation();
    await this.domainConfigurationService.clearAll();
    await this.commitTransaction();
    res.json({ status: "success" });
  }
  /**
   * @swagger
   * /api/configservice/domainconfiguration/createConfiguration:
   *  post:
   *    summary: Creates configuration for specific domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: domaincofig
   *        in: body
   *        schema:
   *          $ref: '#/definitions/domaincofig'
   *        examples: example
   *        required: true
   *        description: There are three required parameters, apibaseurl,domain and orgId for this API.
   *                      These three parameters accepts string type only. The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: The API creates domain with given configurations
   *        content:
   *          application/json
   *      400:
   *        description: In case, if any parameter is empty, null, undefined, blank or if the jwttoken or refreshtoken is invalid
   *                      400 error will be thrown.
   * definitions:
   *  domaincofig:
   *    description: Model token object for domain config API
   *    properties:
   *      apiBaseUrl:
   *        type: string
   *        description: apiBaseUrl of domain
   *      domain:
   *        type: string
   *        description: domain name
   *      orgId:
   *        type: string
   *        description: Organisation Id
   *
   */
  @httpPost("/createConfiguration")
  public async createConfiguration(req: Request, res: Response): Promise<void> {
    this.validateApiEnabled("CREATE_CONFIGURATION_ALLOWED");
    const { apiBaseUrl, domain, orgId } = req.body;
    ValidationUtils.validateStringNotEmpty(domain, "domain");
    ValidationUtils.validateStringNotEmpty(apiBaseUrl, "apiBaseUrl");
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    await this.domainConfigurationService.createApiConfiguration(domain, apiBaseUrl, orgId);
    await this.commitTransaction();
    res.json({ status: "success" });
  }
  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/updateApiConfiguration:
   *  put:
   *    summary: Updates configurations for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: domaincofig
   *        in: body
   *        schema:
   *          $ref: '#/definitions/domaincofig'
   *        examples: example
   *        required: true
   *        description: There are three required parameters, apibaseurl,domain and orgId for this API.
   *                      These three parameters accepts string type only. The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          appliction/json
   * definitions:
   *  domaincofig:
   *    description: Model token object for domain config API
   *    properties:
   *      apiBaseUrl:
   *        type: string
   *        description: apiBaseUrl of domain
   *      domain:
   *        type: string
   *        description: domain name
   *      orgId:
   *        type: string
   *        description: Organisation Id
   *
   */
  @httpPut("/updateApiConfiguration")
  public async updateApiConfiguration(req: Request, res: Response): Promise<void> {
    const { apiBaseUrl, domain, orgId } = req.body;
    ValidationUtils.validateStringNotEmpty(domain, "domain");
    ValidationUtils.validateStringNotEmpty(apiBaseUrl, "apiBaseUrl");
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    await this.domainConfigurationService.updateApiConfiguration(domain, apiBaseUrl, orgId);
    await this.commitTransaction();
    res.json({ status: "success" });
  }
  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/updateProductConfiguration:
   *  put:
   *    summary: Updates Product configurations for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: productconfig
   *        in: body
   *        schema:
   *          $ref: '#/definitions/productconfig'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          application/json
   * definitions:
   *  productconfig:
   *    description: Model object for product config API
   *    properties:
   *      context:
   *        type: string
   *        description: context of product
   *      attribName:
   *        type: string
   *        description: attribute name
   *      value:
   *        type: string
   *        description: value of attribute
   *
   */
  @httpPut("/updateProductConfiguration")
  public async updateProductConfiguration(req: Request, res: Response): Promise<void> {
    const { context, attribName, value } = req.body;
    ValidationUtils.validateStringNotEmpty(context, "context");
    ValidationUtils.validateStringNotEmpty(attribName, "attribName");
    ValidationUtils.validateStringNotEmpty(value, "value");
    await this.domainConfigurationService.updateProductConfiguration(context, attribName, value);
    await this.commitTransaction();
    res.json({ status: "success" });
  }
  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/{domain}:
   *  get:
   *    summary: gets configs for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - in: path
   *        name: domain
   *        schema:
   *          type: string
   *        required: true
   *        description: Domain
   *    responses:
   *      200:
   *        description: Successfull
   *        content:
   *          appliction/json
   *
   */
  @httpGet("/:domain")
  public async fetchConfiguration(req: Request, res: Response): Promise<void> {
    const { domain } = req.params;
    ValidationUtils.validateStringNotEmpty(domain, "Domain");
    let configData = await this.domainConfigurationService.findOne({ domain: domain }, ["apiBaseUrl", "orgId"]);
    if (!configData) {
      await this.commitTransaction();
      ErrUtils.throwValidationError(Constants.DOMAIN_NOT_SUPPORTED_ERR, Constants.DOMAIN_NOT_SUPPORTED);
    } else {
      configData = { ...configData, ...this.getKalturaConfigurations() }
      await this.commitTransaction();
      res.json(configData);
    }
  }
  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/loginPageSettings:
   *  put:
   *    summary: Updates loginPage Settings for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: loginsettings
   *        in: body
   *        schema:
   *          $ref: '#/definitions/loginsettings'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          application/json
   * definitions:
   *  loginsettings:
   *    description: Model token object for login settings API
   *    properties:
   *      apiBaseUrl:
   *        type: string
   *        description: apiBaseUrl of domain
   *      welcomeText:
   *        type: string
   *        description: Welcome Text of Login page
   *      ssoText:
   *        type: string
   *        description: sso Text of Login page
   *      supportText:
   *        type: string
   *        description: supportText of Login page
   *      orgId:
   *        type: string
   *        description: Organisation Id
   *      logoRedirectUrl:
   *        type: string
   *        description: logoRedirectUrl
   *      headerText:
   *        type: string
   *        description: headerText
   *      poweredByUnextLogo:
   *        type: boolean
   *        description: Boolean value to determine the display of poweredByUnext Logo
   *
   */
  @httpPut("/loginPageSettings")
  public async updateLoginPageSettings(req: Request, res: Response): Promise<void> {
    const { orgId, apiBaseUrl, logoRedirectUrl, headerText, welcomeText, ssoText, supportText, poweredByUnextLogo } = req.body;
    ValidationUtils.validateStringNotEmpty(orgId, 'orgId');
    ValidationUtils.validateStringNotEmpty(apiBaseUrl, 'apiBaseUrl');
    ValidationUtils.validateStringNotEmpty(logoRedirectUrl, 'logoRedirectUrl');
    ValidationUtils.validateStringNotEmpty(headerText, 'headerText');
    ValidationUtils.validateIsNotNullOrUndefined(poweredByUnextLogo, 'poweredByUnextLogo');
    ValidationUtils.validateIsBoolean(poweredByUnextLogo,"poweredByUnextLogo");
    ValidationUtils.validateStringNotEmpty(welcomeText, 'welcomeText');
    ValidationUtils.validateStringNotEmpty(ssoText, 'ssoText');
    ValidationUtils.validateStringNotEmpty(supportText, 'supportText');
    const updateParams = {
      orgId: orgId,
      apiBaseUrl: apiBaseUrl,
      welcomeText: welcomeText,
      ssoText: ssoText,
      supportText: supportText,
      logoRedirectUrl: logoRedirectUrl,
      headerText: headerText,
      poweredByUnextLogo: poweredByUnextLogo,
    };
    await this.domainConfigurationService.updateLoginPageConfiguration(updateParams);
    await this.commitTransaction();
    res.json({ status: "success" });
  }

  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/common-login-page-settings:
   *  put:
   *    summary: Updates common login page Settings for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: commonloginsettings
   *        in: body
   *        schema:
   *          $ref: '#/definitions/commonloginsettings'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          application/json
   * definitions:
   *  commonloginsettings:
   *    description: Model token object for common login settings API
   *    properties:
   *      orgId:
   *        type: string
   *        description: org Id of the domain
   *      apiBaseUrl:
   *        type: string
   *        description: apiBaseUrl of domain
   *      headerText:
   *        type: string
   *        description: headerText of the common login page
   *      logoClickUrl:
   *        type: string
   *        description: logoClickUrl of the common login page
   *      welcomeText:
   *        type: string
   *        description: Welcome Text of common Login page
   *      learnerLoginText:
   *        type: string
   *        description: learnerLoginText of common Login page
   *      learnerLoginUrl:
   *        type: string
   *        description: learnerLoginUrl of common Login page
   *      nonLearnerLoginText:
   *        type: string
   *        description: nonLearnerLoginText of common Login page
   *      nonLearnerLoginUrl:
   *        type: string
   *        description: nonLearnerLoginUrl of common Login page
   *      copyright:
   *        type: string
   *        description: copyright text for the common login page
   *      isTermsAndCondition:
   *        type: boolean
   *        description: TermsAndCondition flag value
   *      isPrivacyPolicy:
   *        type: boolean
   *        description: PrivacyPolicy flag value
   *      termsAndConditionText:
   *        type: string
   *        description: termsAndConditionText - pass if isTermsAndCondition is true
   *        required: false
   *      privacyPolicyText:
   *        type: string
   *        description: privacyPolicyText - pass if isPrivacyPolicy is true
   *        required: false
   *      poweredByUnextLogo:
   *        type: boolean
   *        description: Boolean value to determine the display of poweredByUnext Logo
   *
   */
  @httpPut("/common-login-page-settings")
  public async updateCommonLoginPageSettings(req: Request, res: Response): Promise<void> {
    const { orgId, apiBaseUrl, headerText, logoClickUrl, welcomeText, learnerLoginText, learnerLoginUrl, nonLearnerLoginText, nonLearnerLoginUrl, copyright, isTermsAndCondition, termsAndConditionText, isPrivacyPolicy, privacyPolicyText, poweredByUnextLogo } = req.body;
    ValidationUtils.validateStringNotEmpty(orgId, 'orgId');
    ValidationUtils.validateStringNotEmpty(apiBaseUrl, 'apiBaseUrl');
    ValidationUtils.validateStringNotEmpty(headerText, 'headerText');
    ValidationUtils.validateStringNotEmpty(logoClickUrl, 'logoClickUrl');
    ValidationUtils.validateStringNotEmpty(welcomeText, 'welcomeText');
    ValidationUtils.validateStringNotEmpty(learnerLoginText, 'learnerLoginText');
    ValidationUtils.validateStringNotEmpty(learnerLoginUrl, 'learnerLoginUrl');
    ValidationUtils.validateStringNotEmpty(nonLearnerLoginText, 'nonLearnerLoginText');
    ValidationUtils.validateStringNotEmpty(nonLearnerLoginUrl, 'nonLearnerLoginUrl');
    ValidationUtils.validateStringNotEmpty(copyright, 'copyright');
    ValidationUtils.validateIsBoolean(isTermsAndCondition,'isTermsAndCondition');
    if(isTermsAndCondition && isTermsAndCondition.toString() === 'true') {
      ValidationUtils.validateStringNotEmpty(termsAndConditionText, 'termsAndConditionText');
    }
    ValidationUtils.validateIsBoolean(isPrivacyPolicy,'isPrivacyPolicy');
    if(isPrivacyPolicy && isPrivacyPolicy.toString() === 'true') {
      ValidationUtils.validateStringNotEmpty(privacyPolicyText, 'privacyPolicyText');
    }
    ValidationUtils.validateIsBoolean(poweredByUnextLogo,'poweredByUnextLogo');
    const updateParams = {
      orgId,
      apiBaseUrl,
      headerText,
      logoClickUrl,
      welcomeText,
      learnerLoginText,
      learnerLoginUrl,
      nonLearnerLoginUrl,
      nonLearnerLoginText,
      copyright,
      isTermsAndCondition,
      isPrivacyPolicy,
      poweredByUnextLogo,
    };
    if(isTermsAndCondition && isTermsAndCondition.toString() === 'true') {
      updateParams['termsAndConditionText'] = termsAndConditionText;
    }
    if(isPrivacyPolicy && isPrivacyPolicy.toString() === 'true') {
      updateParams['privacyPolicyText'] = privacyPolicyText;
    }
    await this.domainConfigurationService.updateCommonLoginPageConfiguration(updateParams);
    await this.commitTransaction();
    res.json({ status: "success" });
  }


  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/individual-login-page-settings:
   *  put:
   *    summary: Updates individual login page Settings for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: individualloginsettings
   *        in: body
   *        schema:
   *          $ref: '#/definitions/individualloginsettings'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          application/json
   * definitions:
   *  individualloginsettings:
   *    description: Model token object for individual login settings API
   *    properties:
   *      orgId:
   *        type: string
   *        description: org Id of the domain
   *      apiBaseUrl:
   *        type: string
   *        description: apiBaseUrl of domain
   *      headerText:
   *        type: string
   *        description: headerText of the individual login page
   *      logoClickUrl:
   *        type: string
   *        description: logoClickUrl of the individual login page
   *      welcomeText:
   *        type: string
   *        description: Welcome Text of individual Login page
   *      learnerLoginPersona:
   *        type: array
   *        description: learnerLoginPersona of individual Login page
   *      nonLearnerLoginPersona:
   *        type: string
   *        description: nonLearnerLoginPersona of individual Login page eg. sso or native
   *      ssoText:
   *        type: string
   *        description: ssoText of individual Login page - pass only if the nonLearnerPersona and Learner Persona includes sso
   *        required: false
   *      supportText:
   *        type: string
   *        description: supportText of individual Login page
   *      copyright:
   *        type: string
   *        description: copyright text for the individual login page
   *      isTermsAndCondition:
   *        type: boolean
   *        description: TermsAndCondition flag value
   *      isPrivacyPolicy:
   *        type: boolean
   *        description: PrivacyPolicy flag value
   *      termsAndConditionText:
   *        type: string
   *        description: termsAndConditionText - pass if isTermsAndCondition is true
   *        required: false
   *      privacyPolicyText:
   *        type: string
   *        description: privacyPolicyText - pass if isPrivacyPolicy is true
   *        required: false
   *      poweredByUnextLogo:
   *        type: boolean
   *        description: Boolean value to determine the display of poweredByUnext Logo
   *
   */
  @httpPut("/individual-login-page-settings")
  public async updateIndividualLoginPageSettings(req: Request, res: Response): Promise<void> {
    const { orgId, apiBaseUrl, headerText, logoClickUrl, welcomeText, learnerLoginPersona, nonLearnerLoginPersona, ssoText, supportText, copyright, isTermsAndCondition, termsAndConditionText, isPrivacyPolicy, privacyPolicyText, poweredByUnextLogo } = req.body;
    ValidationUtils.validateStringNotEmpty(orgId, 'orgId');
    ValidationUtils.validateStringNotEmpty(apiBaseUrl, 'apiBaseUrl');
    ValidationUtils.validateStringNotEmpty(headerText, 'headerText');
    ValidationUtils.validateStringNotEmpty(logoClickUrl, 'logoClickUrl');
    ValidationUtils.validateStringNotEmpty(welcomeText, 'welcomeText');
    ValidationUtils.validateIsArray(learnerLoginPersona, 'learnerLoginPersona');
    ValidationUtils.validateArrayNotEmpty(learnerLoginPersona, 'learnerLoginPersona');
    const validateLoginPersona = learnerLoginPersona.every(val => LearnerLoginPersona.includes(val));
    if(!validateLoginPersona) {
      ErrUtils.throwValidationError(Constants.INVALID_LEARNER_LOGIN_PERSONA_ERR, Constants.INVALID_LEARNER_LOGIN_PERSONA);
    }
    ValidationUtils.validateStringNotEmpty(nonLearnerLoginPersona, 'nonLearnerLoginPersona');
    const validateNonLoginPersona = NonLearnerLoginPersona.includes(nonLearnerLoginPersona);
    if(!validateNonLoginPersona) {
      ErrUtils.throwValidationError(Constants.INVALID_NON_LEARNER_LOGIN_PERSONA_ERR, Constants.INVALID_NON_LEARNER_LOGIN_PERSONA);
    }
    if(nonLearnerLoginPersona === 'sso') {
      ValidationUtils.validateStringNotEmpty(ssoText, 'ssoText');
    }
    ValidationUtils.validateStringNotEmpty(supportText, 'supportText');
    ValidationUtils.validateStringNotEmpty(copyright, 'copyright');
    ValidationUtils.validateIsBoolean(isTermsAndCondition,'isTermsAndCondition');
    if(isTermsAndCondition && isTermsAndCondition.toString() === 'true') {
      ValidationUtils.validateStringNotEmpty(termsAndConditionText, 'termsAndConditionText');
    }
    ValidationUtils.validateIsBoolean(isPrivacyPolicy,'isPrivacyPolicy');
    if(isPrivacyPolicy && isPrivacyPolicy.toString() === 'true') {
      ValidationUtils.validateStringNotEmpty(privacyPolicyText, 'privacyPolicyText');
    }
    ValidationUtils.validateIsBoolean(poweredByUnextLogo,'poweredByUnextLogo');
    const updateParams = {
      orgId,
      apiBaseUrl,
      headerText,
      logoClickUrl,
      welcomeText,
      learnerLoginPersona,
      nonLearnerLoginPersona,
      ssoText,
      supportText,
      copyright,
      isTermsAndCondition,
      isPrivacyPolicy,
      poweredByUnextLogo,
    };
    if(isTermsAndCondition && isTermsAndCondition.toString() === 'true') {
      updateParams['termsAndConditionText'] = termsAndConditionText;
    }
    if(isPrivacyPolicy && isPrivacyPolicy.toString() === 'true') {
      updateParams['privacyPolicyText'] = privacyPolicyText;
    }
    await this.domainConfigurationService.updateCommonLoginPageConfiguration(updateParams);
    await this.commitTransaction();
    res.json({ status: "success" });
  }

  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/loginPageSettings/{orgId}:
   *  get:
   *    summary: gets configs for loginpage
   *    tags: [Domain configuration]
   *    parameters:
   *      - in: path
   *        name: orgId
   *        schema:
   *          type: string
   *        required: true
   *        description: orgId
   *    responses:
   *      200:
   *        description: Successfull
   *        content:
   *          application/json
   *
   */
  @httpGet("/loginPageSettings/:orgId")
  public async fetchLoginPageConfiguration(req: Request, res: Response): Promise<void> {
    const { orgId } = req.params;
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    const [orgConfigData, productConfigData] = await Promise.all([this.domainConfigurationService.fetchOrgsConfig({ orgId: orgId, context: "loginPage" }), this.domainConfigurationService.fetchProductConfig({ context: "loginPage" })]);
    if (!orgConfigData.length) {
      await this.commitTransaction();
      ErrUtils.throwValidationError(Constants.ORGID_NOT_SUPPORTED_ERR, Constants.ORGID_NOT_SUPPORTED);
    } else {
      const formattedOrgConfig = this.formatOrgConfig(orgConfigData);
      const formattedProductConfig = this.formatProductConfig(productConfigData);
      await this.commitTransaction();
      res.json({ ...formattedProductConfig, ...formattedOrgConfig });
    }
  }
  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/brandingPageSettings:
   *  put:
   *    summary: Updates brandingpage Settings for domain
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: brandingsettings
   *        in: body
   *        schema:
   *          $ref: '#/definitions/brandingsettings'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          application/json
   * definitions:
   *  brandingsettings:
   *    description: Model token object for branding settings API
   *    properties:
   *      orgId:
   *        type: string
   *        description: Org Id of the Domain
   *      bannerType:
   *        type: string
   *        description: bannerType of the background Image which we are setting
   *      headerText:
   *        type: string
   *        description: Header Text for the branding Page
   *      greetingsText:
   *        type: string
   *        description: Welcome message of the Branding Page
   *      announcementMessage:
   *        type: string
   *        description: Announcement message for the Branding Page (should be passed if announcement status is true)
   *      announcementStatus:
   *        type: boolean
   *        description: Boolean value decides wheather the announcementMessage should display
   *      screenDuration:
   *        type: string
   *        description: screenDuration of the Message
   *      poweredByUnextLogo:
   *        type: boolean
   *        description: Boolean value to determine the display of poweredByUnext Logo
   *
   */
  @httpPut("/brandingPageSettings")
  public async updateBrandingPageSettings(req: Request, res: Response): Promise<void> {
    const { orgId, bannerType, headerText, greetingsText, announcementMessage, announcementStatus, screenDuration, poweredByUnextLogo } = req.body;
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    ValidationUtils.validateStringNotEmpty(bannerType, "bannerType");
    ValidationUtils.validateStringNotEmpty(headerText, "headerText");
    ValidationUtils.validateStringNotEmpty(greetingsText, "greetingsText");
    ValidationUtils.validateIsPositiveInteger(screenDuration, "screenDuration");
    if (announcementStatus) {
      ValidationUtils.validateStringNotEmpty(announcementMessage, "announcementMessage");
    }
    ValidationUtils.validateIsBoolean(poweredByUnextLogo,"poweredByUnextLogo");
    ValidationUtils.validateIsBoolean(announcementStatus,"announcementStatus");
    const updateParams = {
      orgId: orgId,
      bannerType: bannerType,
      headerText: headerText,
      greetingsText: greetingsText,
      announcementMessage: announcementMessage,
      announcementStatus: announcementStatus,
      screenDuration: screenDuration,
      poweredByUnextLogo: poweredByUnextLogo,
    };
    await this.domainConfigurationService.updateBrandingPage(updateParams);
    await this.commitTransaction();
    res.json({ status: "success" });
  }

  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/imageContent:
   *  put:
   *    summary: Upload Image Content
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: imageparameters
   *        in: body
   *        schema:
   *          $ref: '#/definitions/imageparameters'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: Successfully Updated
   *        content:
   *          application/json
   * definitions:
   *  imageparameters:
   *    description: Model token object for upload Image API
   *    properties:
   *      orgId:
   *        type: string
   *        description: Org Id of the Domain
   *      imageName:
   *        type: string
   *        description: Name of the image
   *      imageContent:
   *        type: string
   *        description: Image content as base64
   *      uriContext:
   *        type: string
   *        description: context of the Image
   */

  @httpPut("/imageContent")
  public async uploadImageContent(req: Request, res: Response): Promise<void> {
    const { orgId, imageName, uriContext, imageContent } = req.body;
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    ValidationUtils.validateStringNotEmpty(imageName, "imageName");
    ValidationUtils.validateStringNotEmpty(imageContent, "imageContent");
    const hash = await Crypto.createHash("sha256").update(imageContent).digest("hex");
    const updateParams = {
      orgId: orgId,
      attribName: imageName,
      value: imageContent,
      hash: hash,
      context: "imageContent",
      uriContext: uriContext,
    };
    await this.domainConfigurationService.updateImageContent(updateParams);
    await this.commitTransaction();
    res.json({ status: "success" });
  }

  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/imageContent/{imageContent}?orgId={orgId}&hash={hash}:
   *  get:
   *    summary: Gets the Image Content when Org Id and Hash are passed as query param and takes Image Name as Path param
   *    tags: [Domain configuration]
   *    produces:
   *    - application/octet-stream
   *    parameters:
   *      - in: path
   *        name: imageContent
   *        schema:
   *          type: string
   *        required: true
   *        description: Domain
   *      - in: query
   *        name: orgId
   *        schema:
   *          type: string
   *        required: true
   *        description: Org Id of the Image Content which has to be retreived
   *      - in: query
   *        name: hash
   *        schema:
   *          type: string
   *        required: true
   *        description: Hash of the Image
   *    responses:
   *      200:
   *        description: Successfully retrieves the Image content
   *        content:
   *          application/prs.binary
   *
   */
  @httpGet("/imageContent/:imageContent")
  public async fetchImageContent(req: Request, res: Response): Promise<void> {
    const { imageContent } = req.params;
    const { orgId, hash } = req.query;
    ValidationUtils.validateStringNotEmpty(imageContent, "imageContent");
    ValidationUtils.validateStringNotEmpty(orgId ? orgId.toString() : "", "orgId");
    ValidationUtils.validateStringNotEmpty(hash ? hash.toString() : "", "hash");
    const imageData: any = await this.domainConfigurationService.fetchOrgsConfig({ orgId: orgId, context: "imageContent", attribName: imageContent });
    if (!imageData.length) {
      const imageDatafromproduct: any = await this.domainConfigurationService.fetchProductConfig({ attribName: imageContent, context: "imageContent" });
      if (!imageDatafromproduct.length) {
        await this.commitTransaction();
        ErrUtils.throwValidationError(Constants.IMAGEDATA_NOT_FOUND_ERR, Constants.IMAGEDATA_NOT_FOUND);
      }
      const binaryData = this.convertToBinary(imageDatafromproduct[0].value);
      res.set("Cache-control", "public, max-age=15780000");
      await this.commitTransaction();
      res.end(binaryData, "binary");
    } else {
      const binaryData = this.convertToBinary(imageData[0].value);
      res.set("Cache-control", "public, max-age=15780000");
      await this.commitTransaction();
      res.end(binaryData, "binary");
    }
  }

  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/genericSettings/{orgId}/{context}:
   *  get:
   *    summary: gets configs for loginpage
   *    tags: [Domain configuration]
   *    parameters:
   *      - in: path
   *        name: orgId
   *        schema:
   *          type: string
   *        required: true
   *        description: orgId
   *      - in: path
   *        name: context
   *        schema:
   *          type: string
   *        required: true
   *        description: context
   *    responses:
   *      200:
   *        description: Successfull
   *        content:
   *          application/json
   *
   */

  @httpGet("/genericSettings/:orgId/:context")
  public async fetchGenericConfiguration(req: Request, res: Response): Promise<void> {
    const { orgId, context } = req.params;
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    ValidationUtils.validateStringNotEmpty(context, "context");
    const [orgConfigData, productConfigData] = await Promise.all([this.domainConfigurationService.fetchOrgsConfig({ orgId: orgId, context: context }), this.domainConfigurationService.fetchProductConfig({ context: context })]);
    if (!orgConfigData.length) {
      await this.commitTransaction();
      ErrUtils.throwValidationError(Constants.ORGID_CONTEXT_NOT_SUPPORTED_ERR, Constants.ORGID_CONTEXT_NOT_SUPPORTED_ERR);
    } else {
      const formattedOrgConfig = this.formatOrgConfig(orgConfigData);
      const formattedProductConfig = this.formatProductConfig(productConfigData);
      await this.commitTransaction();
      res.json({ ...formattedProductConfig, ...formattedOrgConfig });
    }
  }

  /**
   *
   * @swagger
   * /api/configservice/domainconfiguration/imageContent:
   *  delete:
   *    summary: Deletes Image Content and Image Hash in the Org level Settings
   *    tags: [Domain configuration]
   *    parameters:
   *      - name: deleteimagemodel
   *        in: body
   *        schema:
   *          $ref: '#/definitions/deleteimagemodel'
   *        examples: example
   *        required: true
   *        description:  The model for the parameters are described below.
   *    responses:
   *      200:
   *        description: { status: "success" }
   *        content:
   *          application/json
   * definitions:
   *  deleteimagemodel:
   *    description: Model deleteImage object for Delete Image API
   *    properties:
   *      orgId:
   *        type: string
   *        description: Org Id of the Org Level for which the Image content and Hash should be deleted
   *      imageName:
   *        type: string
   *        description: imageName of the Org for which the content and hash should be deleted
   *
   */
  @httpDelete("/imageContent/")
  public async delete(req: Request, res: Response): Promise<void> {
    const { orgId, imageName } = req.body;
    ValidationUtils.validateStringNotEmpty(orgId, "orgId");
    ValidationUtils.validateStringNotEmpty(imageName, "imageName");
    const imageData = await this.domainConfigurationService.fetchOrgsConfig({
      $or: [
        { orgId, attribName: `${imageName}Hash` },
        { orgId, attribName: `${imageName}Content` },
        { orgId, attribName: `${imageName}_URL` },
      ],
    });
    if (!imageData.length) {
      await this.commitTransaction();
      ErrUtils.throwValidationError(Constants.IMAGEDATA_NOT_FOUND_ERR, Constants.IMAGEDATA_NOT_FOUND);
    }
    await this.domainConfigurationService.deleteImageAndHash(orgId, imageName);
    await this.commitTransaction();
    res.json({ status: "success" });
  }
}
