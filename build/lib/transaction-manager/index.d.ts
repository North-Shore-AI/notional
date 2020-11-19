import { AxiosInstance } from 'axios';
import { Schema, TableKeySet } from '../notional/types';
import { UpdateData } from '../table/types';
export default class TransactionManager {
    private readonly axios;
    private readonly userId;
    private readonly keys?;
    constructor(axios: AxiosInstance, userId: string, keys?: TableKeySet | undefined);
    private formatToDateNode;
    private formatUserType;
    private formatToNotionTextNode;
    private submitTransaction;
    update(insertionData: UpdateData[]): Promise<import("axios").AxiosResponse<any>>;
    delete(blockIds: string[]): Promise<import("axios").AxiosResponse<any>>;
    setSchema(schema: Schema): Promise<import("axios").AxiosResponse<any>>;
    insert(data: object[][]): Promise<import("axios").AxiosResponse<any>>;
}
