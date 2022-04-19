import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { Utils } from '../utils/Utils';

interface IOrgConfigsModel extends Document {
  orgConfigId: string,
  orgId: string,
  context: string,
  attribName: string,
  value: any
}

const orgconfigSchema: Schema = new Schema({
  orgConfigId: { type: String, index: true, unique: true, default: Utils.generateUuid },
  orgId: { type: String, index: true },
  context: { type: String, index: true },
  attribName: { type: String, index: true },
  value: { type: Schema.Types.Mixed, index: true },
}, { versionKey: false });

const OrgConfigsModel = mongoose.model<IOrgConfigsModel>('orgconfig', orgconfigSchema);

export { IOrgConfigsModel, OrgConfigsModel };