"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_1 = __importDefault(require("lodash/get"));
var compact_1 = __importDefault(require("lodash/compact"));
var crypto_1 = __importDefault(require("crypto"));
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var uuid_1 = require("uuid");
var transaction_manager_1 = __importDefault(require("../transaction-manager"));
var METADATA_TYPES = [
    'created_by',
    'created_time',
    'last_edited_by',
    'last_edited_time',
];
var Table = /** @class */ (function () {
    function Table(keys, axios, userId) {
        this.keys = keys;
        this.axios = axios;
        this.userId = userId;
        this.transactionManager = new transaction_manager_1.default(this.axios, this.userId, this.keys);
        this.queryCaching = false;
        this.cachedQueryData = null;
        this.schema = null;
        this.users = null;
    }
    Table.prototype.setQueryCaching = function (caching) {
        this.queryCaching = caching;
        if (!caching) {
            this.cachedQueryData = null;
        }
    };
    Table.prototype.isDateModifier = function (modifiers) {
        return !!modifiers && !!modifiers[0] && modifiers[0][0] === 'd';
    };
    Table.prototype.isUserModifier = function (modifiers) {
        return !!modifiers && !!modifiers[0] && modifiers[0][0] === 'u';
    };
    Table.prototype.parseText = function (textNode) {
        if (!textNode) {
            return '';
        }
        var _a = textNode[0], textValue = _a[0], textModifiers = _a[1];
        if (textModifiers) {
            if (this.isDateModifier(textModifiers)) {
                return textModifiers[0][1];
            }
            else if (this.isUserModifier(textModifiers)) {
                // TODO: Return a user name
                return textModifiers[0][1];
            }
        }
        return textValue;
    };
    Table.prototype.formatRawDataToType = function (data, type) {
        var stringValue = this.parseText(data);
        switch (type) {
            case 'multi_select':
                return stringValue.split(',');
            case 'checkbox':
                return stringValue === 'Yes';
            default:
                return stringValue;
        }
    };
    Table.prototype.getDefaultValueForType = function (type) {
        switch (type) {
            case 'file':
            case 'multi_select':
                return [];
            case 'checkbox':
                return false;
            default:
                return null;
        }
    };
    Table.prototype.useBlockValueForType = function (type, data) {
        var lastEdited = data.last_edited_by_id, lastTimeEdited = data.last_edited_time, createdBy = data.created_by_id, timeCreated = data.created_time;
        switch (type) {
            case 'last_edited_by':
                return lastEdited;
            case 'last_edited_time':
                return lastTimeEdited ? new Date(lastTimeEdited).toISOString() : null;
            case 'created_by':
                return createdBy;
            case 'created_time':
                return timeCreated ? new Date(timeCreated).toISOString() : null;
            default:
                return null;
        }
    };
    Table.prototype.queryCollection = function (_a) {
        var collectionId = _a.collectionId, collectionViewId = _a.collectionViewId;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.queryCaching && this.cachedQueryData) {
                            return [2 /*return*/, Promise.resolve(this.cachedQueryData)];
                        }
                        return [4 /*yield*/, this.axios.post('/queryCollection', {
                                collectionId: collectionId,
                                collectionViewId: collectionViewId,
                                loader: {
                                    limit: 100,
                                    loadContentCover: false,
                                    type: 'table',
                                    userLocale: 'en',
                                    userTimeZone: 'Europe/London',
                                },
                                query: {
                                    aggregate: [],
                                    filter: [],
                                    filter_operator: 'and',
                                    sort: [],
                                },
                            })];
                    case 1:
                        response = _b.sent();
                        if (this.queryCaching) {
                            this.cachedQueryData = response.data;
                        }
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Table.prototype.formatToUserId = function (value) {
        var _a;
        if (!this.users) {
            return value;
        }
        var user = this.users.find(function (user) {
            return user.id === value ||
                (user.firstname + " " + user.lastname).toLowerCase() ===
                    value.toLowerCase();
        });
        return ((_a = user) === null || _a === void 0 ? void 0 : _a.id) || value;
    };
    Table.prototype.getFilteredBlockData = function (filters, additionalData, filterByAdditionalData) {
        if (additionalData === void 0) { additionalData = {}; }
        if (filterByAdditionalData === void 0) { filterByAdditionalData = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, recordMap, blocks, schema, rowData, filterKeys;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryCollection(this.keys)];
                    case 1:
                        _a = (_b.sent()), result = _a.result, recordMap = _a.recordMap;
                        blocks = result.blockIds.map(function (id) { return recordMap.block[id]; });
                        schema = get_1.default(recordMap, "collection." + this.keys.collectionId + ".value.schema", {});
                        rowData = blocks.map(function (block) {
                            return {
                                block_id: block.value.id,
                                block_data: block.value.properties,
                            };
                        });
                        filterKeys = Object.keys(filters);
                        return [2 /*return*/, rowData
                                .map(function (row) {
                                var filterOutRow = (filterKeys.length > 0) ? true : false;
                                var formattedData = Object.entries(schema).reduce(function (data, _a) {
                                    var key = _a[0], headingData = _a[1];
                                    var value;
                                    if (!row.block_data || !row.block_data[key]) {
                                        value = _this.getDefaultValueForType(headingData.type);
                                    }
                                    else {
                                        value = _this.formatRawDataToType(row.block_data[key], headingData.type);
                                    }
                                    if (filterKeys.includes(headingData.name) &&
                                        filters[headingData.name] === value) {
                                        filterOutRow = false;
                                    }
                                    var newValue = additionalData[headingData.name];
                                    if (['user', 'person'].includes(headingData.type)) {
                                        newValue = _this.formatToUserId(additionalData[headingData.name]);
                                    }
                                    if (!(filterByAdditionalData && !newValue)) {
                                        data = data.concat({
                                            id: key,
                                            name: headingData.name,
                                            type: headingData.type,
                                            value: newValue !== undefined ? newValue : value,
                                        });
                                    }
                                    return data;
                                }, []);
                                if (filterOutRow) {
                                    return;
                                }
                                return { id: row.block_id, data: formattedData };
                            })
                                .filter(Boolean)];
                }
            });
        });
    };
    Table.prototype.getUsers = function () {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var response, notionSpaces, groupedUserIds, uniqueIds, userIds, userRecordsResponse, notionUsers;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.users && this.users.length) {
                            return [2 /*return*/, Promise.resolve(this.users)];
                        }
                        return [4 /*yield*/, this.axios.post('loadUserContent', {})];
                    case 1:
                        response = _g.sent();
                        notionSpaces = Object.values(((_c = (_b = (_a = response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.recordMap) === null || _c === void 0 ? void 0 : _c.space) || {});
                        groupedUserIds = notionSpaces.map(function (space) { var _a, _b; return (((_b = (_a = space) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.permissions) || []).map(function (permission) { return permission.user_id; }); });
                        uniqueIds = [].concat.apply([], groupedUserIds);
                        userIds = Array.from(new Set(uniqueIds));
                        return [4 /*yield*/, this.axios.post('syncRecordValues', {
                                recordVersionMap: {
                                    notion_user: userIds.reduce(function (block, id) {
                                        block[id] = -1;
                                        return block;
                                    }, {}),
                                },
                            })];
                    case 2:
                        userRecordsResponse = _g.sent();
                        notionUsers = (_f = (_e = (_d = userRecordsResponse) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.recordMap) === null || _f === void 0 ? void 0 : _f.notion_user;
                        this.users = Object.values(notionUsers || {}).map(function (userRecord) { return ({
                            id: userRecord.value.id,
                            firstname: userRecord.value.given_name,
                            lastname: userRecord.value.family_name,
                        }); });
                        return [2 /*return*/, this.users];
                }
            });
        });
    };
    Table.prototype.getCollectionSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collectionBlocks, rawSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.schema) {
                            return [2 /*return*/, Promise.resolve(this.schema)];
                        }
                        return [4 /*yield*/, this.queryCollection(this.keys)];
                    case 1:
                        collectionBlocks = _a.sent();
                        rawSchema = get_1.default(collectionBlocks, "recordMap.collection." + this.keys.collectionId + ".value.schema", {});
                        this.schema = Object.keys(rawSchema).reduce(function (obj, key) {
                            var _a = rawSchema[key], name = _a.name, rest = __rest(_a, ["name"]);
                            if (name !== undefined && name !== null) {
                                obj[name] = __assign(__assign({}, rest), { id: key });
                            }
                            return obj;
                        }, {});
                        return [2 /*return*/, this.schema];
                }
            });
        });
    };
    Table.prototype.getKeys = function () {
        return this.keys;
    };
    Table.prototype.getRows = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, recordMap, blocks, schema, data;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryCollection(this.keys)];
                    case 1:
                        _a = (_b.sent()), result = _a.result, recordMap = _a.recordMap;
                        blocks = result.blockIds.map(function (id) { return recordMap.block[id]; });
                        schema = get_1.default(recordMap, "collection." + this.keys.collectionId + ".value.schema", {});
                        data = blocks.map(function (_a) {
                            var _b = _a.value, row = _b.properties, additionalProperties = __rest(_b, ["properties"]);
                            return Object.entries(schema).reduce(function (data, _a) {
                                var key = _a[0], headingData = _a[1];
                                if (!row || !row[key]) {
                                    data[headingData.name] = _this.getDefaultValueForType(headingData.type);
                                }
                                else {
                                    data[headingData.name] = _this.formatRawDataToType(row[key], headingData.type);
                                }
                                if (METADATA_TYPES.includes(headingData.type)) {
                                    data[headingData.name] = _this.useBlockValueForType(headingData.type, additionalProperties);
                                }
                                return data;
                            }, {});
                        });
                        return [2 /*return*/, data.filter(function (row) {
                                var filterKeys = Object.keys(filters);
                                var applicableFilterKeys = Object.keys(row).filter(function (key) {
                                    return filterKeys.includes(key);
                                });
                                return applicableFilterKeys.every(function (filterKey) {
                                    var filter = filters[filterKey];
                                    if (typeof filter === 'function') {
                                        return filter(row[filterKey]);
                                    }
                                    else {
                                        return isEqual_1.default(filter, row[filterKey]);
                                    }
                                });
                            })];
                }
            });
        });
    };
    Table.prototype.insertRows = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaMap, entriesToInsert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCollectionSchema()];
                    case 1:
                        schemaMap = (_a.sent());
                        entriesToInsert = data.map(function (datum) {
                            return compact_1.default(Object.entries(datum).map(function (_a) {
                                var key = _a[0], value = _a[1];
                                var schemaData = schemaMap[key];
                                if (!schemaData) {
                                    console.warn("Unrecognised key \"" + key + "\". Ignoring.");
                                    return;
                                }
                                var id = schemaData.id, type = schemaData.type;
                                return {
                                    id: id,
                                    type: type,
                                    value: value,
                                };
                            }));
                        });
                        return [2 /*return*/, this.transactionManager.insert(entriesToInsert)];
                }
            });
        });
    };
    Table.prototype.updateRows = function (dataToUpdate, filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setQueryCaching(true);
                        return [4 /*yield*/, this.getFilteredBlockData(filters, dataToUpdate, true)];
                    case 1:
                        data = (_a.sent());
                        this.setQueryCaching(false);
                        if (!data.length) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.transactionManager.update(data)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Table.prototype.deleteRows = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setQueryCaching(true);
                        return [4 /*yield*/, this.getFilteredBlockData(filters)];
                    case 1:
                        data = (_a.sent());
                        this.setQueryCaching(false);
                        if (!data.length) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.transactionManager.delete(data.map(function (block) { return block.id; }))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Table.prototype.where = function (filters) {
        var _this = this;
        if (filters === void 0) { filters = {}; }
        return {
            update: function (data) { return _this.updateRows(data, filters); },
            delete: function () { return _this.deleteRows(filters); },
            get: function () { return _this.getRows(filters); },
        };
    };
    // Make sure to leave existing columns in case they hold data
    // If an id is provided, this method will rename the existing column
    Table.prototype.updateColumns = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionBlocks, rawSchema, newSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryCollection(this.keys)];
                    case 1:
                        collectionBlocks = _a.sent();
                        rawSchema = get_1.default(collectionBlocks, "recordMap.collection." + this.keys.collectionId + ".value.schema", {});
                        newSchema = Object.entries(schema).reduce(function (newSchema, _a) {
                            var key = _a[0], headingData = _a[1];
                            var id;
                            if (headingData.type === 'title') {
                                id = 'title';
                            }
                            else if (headingData.id) {
                                id = headingData.id;
                            }
                            else {
                                var existing = Object.entries(rawSchema).find(function (_a) {
                                    var id = _a[0], cell = _a[1];
                                    return cell.name === key;
                                });
                                id = existing
                                    ? existing[0]
                                    : crypto_1.default.randomFillSync(Buffer.alloc(2)).toString('hex');
                            }
                            newSchema[id] = { name: key, type: headingData.type };
                            if (headingData.options) {
                                newSchema[id].options = headingData.options.reduce(function (options, option) {
                                    var id = option.id || uuid_1.v4();
                                    var previous = options.find(function (previous) { return previous.id === id || previous.value === option.value; });
                                    if (!previous) {
                                        options.push({ id: id, value: option.value, color: option.color });
                                    }
                                    return options;
                                }, newSchema[id].options || []);
                            }
                            return newSchema;
                        }, rawSchema);
                        return [4 /*yield*/, this.transactionManager.setSchema(newSchema)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Table;
}());
exports.default = Table;
