import { TableKeySet, UserCache, KeyValues, MultiSelectOption } from '../notional/types';
import { AxiosInstance } from 'axios';
import TransactionManager from '../transaction-manager';
export default class Table {
    private readonly keys;
    private readonly axios;
    private readonly userId;
    transactionManager: TransactionManager;
    queryCaching: boolean;
    cachedQueryData: object | null;
    schema: object | null;
    users: UserCache[] | null;
    constructor(keys: TableKeySet, axios: AxiosInstance, userId: string);
    private setQueryCaching;
    private isDateModifier;
    private isUserModifier;
    private parseText;
    private formatRawDataToType;
    private getDefaultValueForType;
    private useBlockValueForType;
    private queryCollection;
    private formatToUserId;
    private getFilteredBlockData;
    getUsers(): Promise<UserCache[]>;
    getCollectionSchema(): Promise<object>;
    getKeys(): TableKeySet;
    getRows(filters?: object): Promise<Record<string, any>[]>;
    insertRows(data: object[]): Promise<import("axios").AxiosResponse<any>>;
    updateRows(dataToUpdate: KeyValues, filters?: KeyValues): Promise<import("axios").AxiosResponse<any> | never[]>;
    deleteRows(filters?: KeyValues): Promise<import("axios").AxiosResponse<any> | never[]>;
    where(filters?: KeyValues): {
        update: (data: Record<string, string | Function | string[]>) => Promise<import("axios").AxiosResponse<any> | never[]>;
        delete: () => Promise<import("axios").AxiosResponse<any> | never[]>;
        get: () => Promise<Record<string, any>[]>;
    };
    updateColumns(schema: Record<string, {
        id?: string;
        options?: Partial<MultiSelectOption>[];
        type: string;
    }>): Promise<import("axios").AxiosResponse<any>>;
}
