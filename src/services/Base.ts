import { injectable } from "inversify";
import { TransactionManagerFactory, OrmOdms, ErrUtils } from "@edunxtv2/service-util";
import { ClientSession } from "mongodb";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { QueryCriteria } from "../interfaces/QueryCriteria";

@injectable()
export abstract class BaseService {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract getModel(): any;

  protected abstract getEntityName(): string;

  protected abstract getIdFieldName(): string;

  async findAll(criteria: QueryCriteria, entityName: string = null): Promise<Document[]> {
    return await this.find(criteria, entityName || this.getEntityName());
  }

  protected async fetchMissingEntityIds(entityIds: string[]): Promise<string[]> {
    const existingEntities: { [s: string]: boolean } =
      await this.fetchExistingEntities(entityIds);

    const missingEntities = [];

    for (const entityId of entityIds) {
      if (!existingEntities[entityId]) {
        missingEntities.push(entityId);
      }
    }

    return missingEntities;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async findOne(query, fieldsToProject = {}): Promise<any> {
    return await this.getModel().findOne(query, fieldsToProject).session(this.getSession()).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async findOneAndUpdate(id: number, updateData): Promise<any> {
    return await this.getModel().findOneAndUpdate({ [this.getIdFieldName()]: id },
      { $set: updateData }, { new: true }).exec();
  }

  public getSession(): ClientSession {
    return TransactionManagerFactory.getInstance(OrmOdms.MONGOOSE).getTransaction();
  }

  public async validateEntitiesExist(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) {
      return;
    }

    const missingEntityIds: string[] = await this.fetchMissingEntityIds(ids);

    if (missingEntityIds.length > 0) {
      throw ErrUtils.createValidationError(
        `The following ${this.getEntityName()} entities were not found in the database: ${missingEntityIds.join(", ")}`,
        "ERROR_CODE_MISSING_ENTITIES");
    }
  }

  protected async fetchExistingEntities(ids: string[]): Promise<{ [s: string]: boolean }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: any = this.getModel();
    const results: { [s: string]: boolean } = {};
    const idFieldName = this.getIdFieldName();

    const entities = await model.find(
      {
        [idFieldName]: {
          $in: ids
        }
      },
      {
        [idFieldName]: 1
      }).session(this.getSession()).exec();

    for (const entity of entities) {
      results[entity[idFieldName]] = true;
    }
    return results;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  protected async createEntity(entity: { [s: string]: any }, entityId: string):
    Promise<Document> {
    try {
      return await this.getModel().create([entity], { session: this.getSession() });
    } catch (err) {
      if (err.message.startsWith("E11000 duplicate key error collection")) {
        ErrUtils.throwValidationError(`Entity ${this.getEntityName()} with id ${entityId} already exists`,
          "ENTITY_EXISTS");
      } else {
        throw err;
      }
    }
  }

  protected convertToObjectIds(ids: string[]): mongoose.Types.ObjectId[] {
    return ids.map((id: string) => {
      return mongoose.Types.ObjectId(id);
    });
  }

  protected convertToObjectId(id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async find(criteria: QueryCriteria, entityName: string = null): Promise<Document[]> {
    //entityName = entityName ? entityName : this.getEntityName();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [];

    if (!criteria.filter) {
      criteria.filter = {};
    }

    pipeline.push({ $match: criteria.filter });

    if (criteria.fields && criteria.fields.length > 0) {
      const fields: { [s: string]: number } = {};
      pipeline.push({ $project: fields });

      for (const field of criteria.fields) {
        fields[field] = 1;
      }
    }

    if (criteria.sortOptions) {
      const sortOptions: { [s: string]: number } = {};
      pipeline.push({ $sort: sortOptions });

      for (const sortOption of criteria.sortOptions) {
        sortOptions[sortOption.sortKey] = sortOption.sortOrder;
      }
    }

    const skip = criteria.skip ? criteria.skip : 0;
    pipeline.push({ $skip: skip });

    const limit = criteria.limit ? criteria.limit : 20;
    pipeline.push({ $limit: limit });

    const results = await this.getModel().aggregate(pipeline).session(this.getSession()).exec();

    return results;
  }

  async findById(id: string): Promise<Document> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: any = this.getModel();
    return await model.findOne({ [this.getIdFieldName()]: id });
  }

  async deleteOne(id: string): Promise<Document> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: any = this.getModel();
    return await model.deleteOne({ [this.getIdFieldName()]: id });
  }

  protected async commit(): Promise<void> {
    await TransactionManagerFactory.getInstance(OrmOdms.MONGOOSE).commit();
  }

  protected async rollback(): Promise<void> {
    await TransactionManagerFactory.getInstance(OrmOdms.MONGOOSE).rollback();
  }

}
