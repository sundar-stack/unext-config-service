/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata';
// tslint:disable-next-line: no-var-requires
require('express-async-errors');
require('dotenv').config();

import { ProviderFactory, ServiceUtil } from '@edunxtv2/service-util';

async function init() {
  require('dotenv').config();

  await ProviderFactory.init(
    [],
    ["AWS_SECRET_ACCESS_KEY", "MONGODB_URL", "X_API_KEY_CONFIGURATIONSERVICE_1", "X_API_KEY_CONFIGURATIONSERVICE_2", "KALTURA_ADMIN_SECRET", "KALTURA_USER_SECRET", "KALTURA_PARTNER_ID", "KALTURA_SUB_PARTNER_ID"],
    ["AWS_DEFAULT_REGION", "AWS_ACCESS_KEY_ID", "IMAGE_CONTENT_BASE_URL", "DOMAIN", "CLEAR_ALL_ENABLED", "CREATE_CONFIGURATION_ALLOWED", "KALTURA_UI_CONFIG_ID", "KALTURA_APP_HOST", "KALTURA_CUE_POINT_URL", "KALTURA_SERVICE_URL", "KALTURA_ENDPOINT_URL", "KALTURA_PRIVILEGES_FOR_SELF_CAPTURE", "KALTURA_PRIVILEGES_FOR_OPTIONS", "KALTURA_VIDEO_EDITOR_SOURCE", "KALTURA_STATS_SOURCE", "KALTURA_VIDEO_OPTIONS_URL"]
  );

  ServiceUtil.init();
  require('./bootstrap').init();
}

init();
