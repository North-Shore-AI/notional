export declare type TableKeySet = {
    collectionId: string;
    collectionViewId: string;
};
export declare type TableKeyCache = {
    [tableIdentifier: string]: TableKeySet;
};
export declare type TableOptions = {
    getUsers?: boolean;
    getCollectionSchema?: boolean;
};
export declare type UserCache = {
    id: string;
    firstname: string;
    lastname: string;
};
export declare type Config = {
    apiKey: string;
    userId: string;
    useCache?: boolean;
    cache?: TableKeyCache;
};
export declare type KeyValues = Record<string, string | string[] | Function>;
declare type BaseValue = {
    id: string;
    version: number;
};
export declare type DateValues = {
    type: 'datetime' | 'daterange' | 'date';
    start_date: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    time_zone?: string;
};
export declare type DateModifiers = [['d', DateValues]];
export declare type UserModifiers = [['u', string]];
export declare type TextNodeModifiers = string[][] | DateModifiers | UserModifiers;
export declare type TextNode = [string, TextNodeModifiers?];
export declare type UserTextNode = [string, [[string, string]]] | string[];
export declare type FormattedData = {
    id: string;
    name: string;
    type: BlockType;
    value: string | string[];
};
export declare type NotionPostData = {
    pageId?: string;
    limit: number;
    chunkNumber: number;
    cursor: {
        stack: any[];
    };
    verticalColumns: boolean;
};
export declare type Role = 'reader' | 'editor' | 'read_and_write';
export declare type BlockType = 'table' | 'to_do' | 'quote' | 'toggle' | 'numbered_list' | 'bulleted_list' | 'header' | 'sub_header' | 'sub_sub_header' | 'text' | 'page' | 'divider' | 'callout' | 'date' | 'code' | 'datetime' | 'user' | 'person' | 'collection_view' | 'collection_view_page';
export declare type PluralBlockType = 'tables';
export declare type PageBlock = {
    role: Role;
    value: BaseValue & {
        type: BlockType;
        properties: Record<string, TextNode[]>;
        content: string[];
        format: {
            page_icon: string;
        };
        created_by: string;
        created_time: string;
        last_edited_by: string;
        last_edited_time: string;
        parent_id: string;
        parent_table: string;
        alive: boolean;
        created_by_table: string;
        created_by_id: string;
        last_edited_by_table: string;
        last_edited_by_id: string;
        collection_id: string;
        view_ids: string[];
    };
};
export declare type User = {
    role: Role;
    value: BaseValue & {
        email: string;
        given_name: string;
        family_name: string;
        profile_photo: string;
        onboarding_completed: boolean;
        mobile_onboarding_completed: boolean;
    };
};
export declare type Permission = {
    role: Role;
    type: string;
    user_id: string;
};
export declare type PermissionGroup = {
    id: string;
    name: string;
    user_ids: string[];
};
export declare type UserRecordsToFetch = {
    [key: string]: -1;
};
export declare type Space = {
    role: Role;
    value: BaseValue & {
        name: string;
        domain: string;
        permissions: Permission[];
        permission_groups: PermissionGroup[];
        email_domains: string[];
        icon: string;
        beta_enabled: boolean;
        pages: string;
        disable_public_access: boolean;
        disable_move_to_space: boolean;
        created_by: string;
        created_time: number;
        last_edited_by: string;
        last_edited_time: number;
        created_by_table: string;
        created_by_id: string;
        last_edited_by_table: string;
        last_edited_by_id: string;
    };
};
export declare type Discussion = {
    role: Role;
    value: BaseValue & {
        parent_id: string;
        parent_table: string;
        context?: TextNode[];
        resolved: boolean;
        comments: string[];
    };
};
export declare type Comment = {
    role: Role;
    value: BaseValue & {
        parent_id: string;
        text: TextNode[];
        created_by: string;
        created_time: number;
        alive: boolean;
        created_by_table: string;
        created_by_id: string;
    };
};
export declare type BaseSchemaCell = {
    id?: string;
    name: string;
    type: string;
};
export declare type MultiSelectOption = {
    id: string;
    color: string;
    value: string;
};
export declare type SchemaCell = BaseSchemaCell & {
    options?: MultiSelectOption[];
    title?: {
        name: string;
        type: string;
    };
};
export declare type CollectionPageProperties = {
    visible: boolean;
    property: string;
};
export declare type Schema = Record<string, SchemaCell>;
export declare type Collection = {
    role: Role;
    value: BaseValue & {
        name: TextNode[];
        schema: Schema;
        format: {
            collection_page_properties: CollectionPageProperties[];
        };
        parent_id: string;
        parent_table: string;
        alive: boolean;
    };
};
export declare type PageBlockList = Record<PageBlock['value']['id'], PageBlock>;
export declare type UserList = Record<User['value']['id'], User>;
export declare type SpaceList = Record<Space['value']['id'], Space>;
export declare type DiscussionList = Record<Discussion['value']['id'], Discussion>;
export declare type CommentList = Record<Comment['value']['id'], Comment>;
export declare type PageChunk = {
    block: PageBlockList;
    notion_user: UserList;
    space: SpaceList;
    discussion: DiscussionList;
    comment: CommentList;
    collection: Collection;
};
export declare type FormattedPageBlock = {
    id: string;
    type: string;
    title: string;
    page_icon: string;
    content: string[];
    created_by: User;
    created_at: string;
    last_edited_by: User;
    last_edited_at: string;
};
export declare type GetPageBlocksOptions = {
    raw?: boolean;
};
export declare type NotionPageChunkResponse = {
    recordMap: PageChunk;
};
export declare type CollectionResult = {
    type: string;
    blockIds: string[];
    aggregationResults: string[];
    total: number;
};
export declare type NotionQueryCollectionResponse = {
    result: CollectionResult;
    recordMap: {
        collection: Collection;
        collection_view: 'block';
        block: PageBlockList;
        space: SpaceList;
    };
};
export {};
