import { MongoClient, Db, Collection, InsertOneWriteOpResult } from 'mongodb';
import { GenericObject } from '../interfaces/common';
import { Service } from '../interfaces/Service'

export class DatabaseService implements Service {
  private client: MongoClient;
  private db: Db;
  private publishAppColl: Collection;
  private connectionURL: string = process.env.MONGO_URL ||
    'mongodb://localhost:27017';
  private dbName: string = process.env.MONGO_DB_NAME || 'test';

  constructor() {}

  async initialize() {
    this.client = await MongoClient.connect(this.connectionURL, {});
    this.db = this.client.db(this.dbName);
    this.publishAppColl = this.db.collection("published_app");
  }

  /**
  * Insert a new document into the database
  * @param {object} doc the JSON document to insert
  * @return {boolean} Indicating success or failure of document creation
  */
  async create(doc): Promise<boolean> {
    const result = await this.execute<InsertOneWriteOpResult>(this.publishAppColl, this.publishAppColl.insertOne, doc);
    return Boolean(result.result.ok);
  }

  /**
  * Retrieve a document given a query
  * @param {object} query the JSON describing the object to match
  * @return {object}
  */
  async retrieve<T>(query): Promise<T | null> {
    return await this.execute<T>(this.publishAppColl, this.publishAppColl.findOne, query);
  }

  private async execute<Result>(thisArg, cmd, ...args) {
    try {
      return await cmd.apply(thisArg, args) as Result;
    } catch (e) {
      console.log("DatabaseExecutor:", e.message);
      throw e;
    }
  }
}
