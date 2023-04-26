import { MongoClient } from 'mongodb';

let connection:MongoClient = null;
let mongoURI = process.env.MONGO_URI || 'mongodb+srv://bessycarolinaguevaraleiva:Carolina10+@bessyleiva.uvpkysr.mongodb.net/test';
let mongoDBName = process.env.MONGO_DB_NAME || 'repo';

export const getConnection = async ()=> {
  if( !connection){
    connection = await MongoClient.connect(mongoURI);
  }
  return connection.db(mongoDBName);
}
  