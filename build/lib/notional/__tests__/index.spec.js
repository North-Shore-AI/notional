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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var example_page_chunk_data_json_1 = __importDefault(require("./example-page-chunk-data.json"));
var __1 = require("..");
var table_1 = __importDefault(require("../../table"));
jest.mock('axios');
describe('Notional', function () {
    var _a;
    var baseConfig = {
        apiKey: '123456',
        userId: '123456789',
    };
    var exampleTableUrl = 'https://www.notion.so/example/5c8a847b16a126b171dca49028ab4ef7';
    var exampleTableKeys = (_a = {},
        _a[exampleTableUrl] = {
            collectionId: 'collectionId',
            collectionViewId: 'collectionViewId',
        },
        _a);
    var examplePageDataKeys = {
        collectionId: '506c9abb-47be-4fb8-8656-11ad64db76d1',
        collectionViewId: 'c2db5874-9077-4e4c-9a6f-d90043cefe4a',
    };
    describe('getCachedTableKeys', function () {
        it('returns the cached table keys', function () {
            var notional = new __1.Notional(__assign(__assign({}, baseConfig), { cache: exampleTableKeys }));
            expect(notional.getCachedTableKeys()).toEqual(exampleTableKeys);
        });
        describe('when an initial cache is not provided', function () {
            it('returns an empty cache', function () {
                var notional = new __1.Notional(baseConfig);
                expect(notional.getCachedTableKeys()).toEqual({});
            });
        });
    });
    describe('cacheTableKeys', function () {
        it('adds keys to an empty cache', function () {
            var notional = new __1.Notional(baseConfig);
            var keysBeforeCaching = notional.getCachedTableKeys();
            notional.cacheTableKeys(exampleTableKeys);
            expect(keysBeforeCaching).toEqual({});
            expect(notional.getCachedTableKeys()).toEqual(exampleTableKeys);
        });
        it('returns the cache', function () {
            var notional = new __1.Notional(baseConfig);
            expect(notional.cacheTableKeys(exampleTableKeys)).toEqual(exampleTableKeys);
        });
        describe('when keys already exist in the cache', function () {
            var notional;
            beforeEach(function () {
                notional = new __1.Notional(__assign(__assign({}, baseConfig), { cache: exampleTableKeys }));
            });
            it('merges new keys with the exisiting cache', function () {
                var _a;
                var newKeys = {
                    'new-table-url': {
                        collectionId: 'new-key',
                        collectionViewId: 'new-key-id',
                    },
                };
                notional.cacheTableKeys(newKeys);
                expect(notional.getCachedTableKeys()).toEqual(__assign((_a = {}, _a[exampleTableUrl] = exampleTableKeys[exampleTableUrl], _a), newKeys));
            });
            it('overwrites existing keys', function () {
                var _a, _b;
                notional.cacheTableKeys((_a = {},
                    _a[exampleTableUrl] = {
                        collectionId: 'new-key',
                        collectionViewId: 'new-key-id',
                    },
                    _a));
                expect(notional.getCachedTableKeys()).toEqual((_b = {},
                    _b[exampleTableUrl] = {
                        collectionId: 'new-key',
                        collectionViewId: 'new-key-id',
                    },
                    _b));
            });
        });
    });
    describe('getTableIdsFromPage', function () {
        var notional;
        var post = jest.fn(function () { return ({ data: example_page_chunk_data_json_1.default }); });
        beforeEach(function () {
            jest.clearAllMocks();
            axios_1.default.create.mockReturnValue({
                post: post,
            });
            notional = new __1.Notional(baseConfig);
        });
        it('returns the collection keys from the returned data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tableIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, notional.getTableIdsFromPage('https://www.notion.so/example-company/123456789')];
                    case 1:
                        tableIds = _a.sent();
                        expect(tableIds).toEqual({
                            'https://www.notion.so/example-company/506c9abb-47be-4fb8-8656-11ad64db76d1': examplePageDataKeys,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('adds the collection keys to the cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tableIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, notional.getTableIdsFromPage('https://www.notion.so/example-company/123456789')];
                    case 1:
                        tableIds = _a.sent();
                        expect(notional.getCachedTableKeys()).toEqual(tableIds);
                        return [2 /*return*/];
                }
            });
        }); });
        it('formats the identifer to the correct URL', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tableIds, pageUrls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            notional.getTableIdsFromPage('https://www.notion.so/example-company/nd01z389ejh783rgbx874r'),
                            notional.getTableIdsFromPage('https://www.notion.so/best-company/gfv21jh3udg3yuidb1h3vbhj4g23'),
                            notional.getTableIdsFromPage('https://www.notion.so/nested-company/nested-url/moihjf84whhrf63101hjxn13e'),
                        ])];
                    case 1:
                        tableIds = _a.sent();
                        pageUrls = tableIds.map(function (idObject) { return Object.keys(idObject)[0]; });
                        expect(pageUrls).toEqual([
                            'https://www.notion.so/example-company/506c9abb-47be-4fb8-8656-11ad64db76d1',
                            'https://www.notion.so/best-company/506c9abb-47be-4fb8-8656-11ad64db76d1',
                            'https://www.notion.so/nested-company/506c9abb-47be-4fb8-8656-11ad64db76d1',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('when the request fails', function () {
            beforeEach(function () {
                jest.clearAllMocks();
                axios_1.default.create.mockReturnValue({
                    post: jest.fn().mockRejectedValue(new Error('Network failure!')),
                });
            });
            it('throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error, notional;
                return __generator(this, function (_a) {
                    error = new Error('Network failure!');
                    axios_1.default.create.mockReturnValue({
                        post: jest.fn().mockRejectedValue(error),
                    });
                    notional = new __1.Notional(baseConfig);
                    expect(notional.getTableIdsFromPage('https://www.notion.so/example-company/123456789')).rejects.toBe(error);
                    return [2 /*return*/];
                });
            }); });
        });
    });
    describe('table', function () {
        var notional;
        var post = jest.fn(function () { return ({ data: example_page_chunk_data_json_1.default }); });
        beforeEach(function () {
            jest.clearAllMocks();
            axios_1.default.create.mockReturnValue({
                post: post,
            });
            notional = new __1.Notional(baseConfig);
        });
        describe('when given a string URL', function () {
            it('creates a Table entity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var table;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, notional.table('https://www.notion.so/example-company/123456789')];
                        case 1:
                            table = _a.sent();
                            expect(table).toBeInstanceOf(table_1.default);
                            expect(table.getKeys()).toEqual(examplePageDataKeys);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('uses keys from the cache if they already exist', function () { return __awaiter(void 0, void 0, void 0, function () {
                var notional, table;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notional = new __1.Notional(__assign(__assign({}, baseConfig), { cache: exampleTableKeys }));
                            return [4 /*yield*/, notional.table(exampleTableUrl)];
                        case 1:
                            table = _a.sent();
                            expect(table).toBeInstanceOf(table_1.default);
                            expect(table.getKeys()).toEqual(exampleTableKeys[exampleTableUrl]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when given a set of collection keys', function () {
            it('returns a Table entity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var keys, table;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            keys = {
                                collectionId: 'a03913bc-0590-4216-b801-17f7e08a5b97',
                                collectionViewId: 'a49028ab-5c8a-4ef7-847b-16a126b171dc',
                            };
                            return [4 /*yield*/, notional.table(keys)];
                        case 1:
                            table = _a.sent();
                            expect(table).toBeInstanceOf(table_1.default);
                            expect(table.getKeys()).toEqual(keys);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
