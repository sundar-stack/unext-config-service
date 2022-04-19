import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { Utils } from '../utils/Utils';

interface IApiConfigModel extends Document {
  configId: string,
  domain: string,
  apiBaseUrl: string,
  orgId: string
}

const domainconfigurationSchema: Schema = new Schema({
  configId: { type: String, index: true, unique: true, default: Utils.generateUuid },
  domain: { type: String, index: true },
  apiBaseUrl: { type: String, index: true },
  orgId: { type: String, index: true }
}, { versionKey: false });

const ApiConfigModel = mongoose.model<IApiConfigModel>('domainconfiguration', domainconfigurationSchema);

export { IApiConfigModel, ApiConfigModel };