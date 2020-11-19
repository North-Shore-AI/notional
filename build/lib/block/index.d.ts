import { AxiosInstance } from 'axios';
import TransactionManager from '../transaction-manager';
export default class Block {
    private readonly blockId;
    private readonly axios;
    private readonly userId;
    transactionManager: TransactionManager;
    constructor(blockId: string, axios: AxiosInstance, userId: string);
    update(content: string): Promise<import("axios").AxiosResponse<any>>;
}
