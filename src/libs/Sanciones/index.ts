import { getConnection as getMongoDBConn } from '@models/mongodb/MongoDBConn';
import { SancionDao as SancionesMongoDbDao } from '@server/dao/models/mongodb/SancionDao';
export interface ISanciones {
  nombre: string;
  tsancion: string;
  tcomentario: string;
  edad: number;
  date: Date;
}
export class Sanciones {
  private dao: SancionesMongoDbDao;
  public constructor() {
    const getConnection = getMongoDBConn;
    const SancionesDao = SancionesMongoDbDao;
    getConnection()
      .then((conn) => {
        this.dao = new SancionesDao(conn);
      })
      .catch((ex) => console.error(ex));
  } 
  // Consultas
  public getAllSanciones() {
    return this.dao.getSanciones();
  }
  public getAllSancionesFromUser(id: string) {
    return this.dao.getSancionesByUser(id);
  }
  public getSancionesPaged(page: number, items: number) {
    return this.dao.getSancionesPaged(page, items);
  }
  public getSancionesByUserPaged(userId: string, page: number, items: number) {
    return this.dao.getSancionesByUserPaged(userId, page, items);
  }
  public getSancionesByIndex(index: string) {
    return this.dao.getSancionesById(index);
  }

  public getCountSanciones(userId: string) {
    return this.dao.getCountSanciones(userId);
  }

  public getTypeSumarry(userId: string) {
    return this.dao.getTypeSumarry(userId);
  }

  public addSanciones(sanciones: ISanciones, userId: string) {
    const { nombre,tsancion,edad,tcomentario,date} = sanciones;
    return this.dao.insertNewSancion(
      {
        nombre,
        tsancion,
        edad,
        tcomentario,
        date: new Date(date),
      }, 
      userId,
    );
  }
  public updateSanciones(index: number | string, Sanciones: ISanciones) {
    return (this.dao as SancionesMongoDbDao).updateSancion({
      ...Sanciones,
      _id: index
    });
  }
  public deleteSanciones(index: string) {
    return this.dao.deleteSancion({ _id: index });
  }
}
