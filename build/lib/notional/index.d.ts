import { Config, TableKeyCache, TableKeySet, TableOptions } from './types';
import Table from '../table';
import Block from '../block';
export declare class Notional {
    private userId;
    private tableKeyCache;
    private http;
    private baseConfig;
    constructor({ apiKey, userId, cache }: Config);
    private toUUID;
    private getBaseUrl;
    private formatUriFromURL;
    private loadPageChunk;
    private getTableKeysFromUrl;
    getCachedTableKeys(): TableKeyCache;
    cacheTableKeys(tableKeys: TableKeyCache): TableKeyCache;
    getTableIdsFromPage(pageUrl: string): Promise<TableKeyCache>;
    table(tableUrlOrKeySet: string | TableKeySet, options?: TableOptions): Promise<Table>;
    block(blockId: string): Block;
}
export default function notional({ apiKey, userId, }: {
    apiKey: string;
    userId: string;
}): {
    block: (blockId: string) => Block;
    table: (tableUrlOrKeySet: string | TableKeySet, options?: TableOptions) => Promise<Table>;
};
