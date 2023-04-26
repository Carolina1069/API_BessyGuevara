import {ISanciones } from '../entities/Sancion';
import { AbstractDao } from './AbstractDao';
import { Db, ObjectId } from 'mongodb';

export class SancionDao extends AbstractDao<ISanciones> {
  public constructor(db: Db) {
    super('sanciones', db);
  }
  public getSanciones() {
    return super.findAll();
  }
  public getSancionesByUser(id: string) {
    return super.findByFilter(
      { userId: new ObjectId(id) },
      { sort: { type: -1 } },
    );
  }

  public async getSancionesPaged(page: number = 1, itemsPerPage: number = 10) {
    try {
      const total = await super.getCollection().countDocuments();
      const totalPages = Math.ceil(total / itemsPerPage);
      const items = await super.findByFilter(
        {},
        {
          sort: { type: -1 },
          skip: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        },
      );
      return {
        total,
        totalPages,
        page,
        itemsPerPage,
        items,
      };
    } catch (ex) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }
  public async getSancionesByUserPaged(
    userId: string,
    page: number = 1,
    itemsPerPage: number = 10,
  ) {
    try {
      const total = await super
        .getCollection()
        .countDocuments({ userId: new ObjectId(userId) });
      const totalPages = Math.ceil(total / itemsPerPage);
      const items = await super.findByFilter(
        { userId: new ObjectId(userId) },
        {
          sort: { type: -1 },
          skip: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        },
      );
      return {
        total,
        totalPages,
        page,
        itemsPerPage,
        items,
      };
    } catch (ex) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }

  public getTypeSumarry(userId: string) {
    const match = { $match: { userId: new ObjectId(userId) } };
    const group = { $group: { _id: '$type', item: { $sum: 1 } } };
    return this.aggregate([match, group], {});
  }

  public async getSancionesById(identifier: string) {
    try {
      const result = await super.findByID(identifier);
      return result;
    } catch (ex: unknown) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }

  public async insertNewSancion(newSancion: ISanciones, userId: string) {
    try {
      const { _id, ...newObject } = newSancion;
      newObject.userId = new ObjectId(userId);
      const result = await super.createOne(newObject);
      return result;
    } catch (ex: unknown) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }

  public async updateSancion(updateCashFlow: ISanciones) {
    try {
      const { _id, ...updateObject } = updateCashFlow;
      const result = await super.update(_id as string, updateObject);
      return result;
    } catch (ex: unknown) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }

  public async getCountSanciones(userId: string) {
    try {
      return await super
        .getCollection()
        .countDocuments({ userId: new ObjectId(userId) });
    } catch (ex: unknown) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }

  public async deleteSancion(deleteSancion: Partial<ISanciones>) {
    try {
      const { _id } = deleteSancion;
      const result = await super.delete(_id as string);
      return result;
    } catch (ex: unknown) {
      console.log('SancionesDao mongodb:', (ex as Error).message);
      throw ex;
    }
  }
}
