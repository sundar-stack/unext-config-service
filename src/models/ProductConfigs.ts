import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { Utils } from '../utils/Utils';

interface IProductConfigsModel extends Document {
  productConfigId: string,
  context: string,
  attribName: string,
  value: any
}

const productconfigSchema: Schema = new Schema({
  productConfigId: { type: String, index: true, unique: true, default: Utils.generateUuid },
  context: { type: String, index: true },
  attribName: { type: String, index: true },
  value: { type: Schema.Types.Mixed, index: true },
}, { versionKey: false });

const ProductConfigsModel = mongoose.model<IProductConfigsModel>('productconfig', productconfigSchema);

export { IProductConfigsModel, ProductConfigsModel };