import { Config, TableKeyCache } from './types';

export default class Notion {
  private apiKey: string;
  private userId: string;
  private cachingEnabled: boolean;
  private tableKeyCache: TableKeyCache;

  constructor({
    apiKey,
    userId,
    useCache,
    cache,
  }: Config) {
    if (!apiKey || !userId) {
      throw new Error('Both an apiKey and userId are required');
    }

    this.apiKey = apiKey;
    this.userId = userId;
    this.cachingEnabled = useCache == undefined ? true : useCache;
    this.tableKeyCache = cache || {};
  }

  public cacheTableKeys(tableKeys: TableKeyCache) {
    this.tableKeyCache = {
      ...this.tableKeyCache,
      ...tableKeys,
    }
  }
}