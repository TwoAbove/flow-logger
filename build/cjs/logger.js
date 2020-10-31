"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const circular_json_1 = require("circular-json");
const replace = (key, value) => {
    if (moment_1.default.isMoment(value)) {
        return value.toISOString();
    }
    if (value instanceof Error) {
        const error = {};
        Object.getOwnPropertyNames(value).forEach(k => {
            error[k] = value[k];
        });
        return error;
    }
    if (value && value.type === 'Buffer') {
        return Buffer.from(value.data).toString('base64');
    }
    return value;
};
const clean = (json) => circular_json_1.stringify(json, replace, null, true);
class Logger {
    constructor(config) {
        this.name = config.name;
        this.persistentId = config.persistentId;
        this.version = config.version;
    }
    get now() {
        return moment_1.default();
    }
    timed(what, comment, duplicate = 1) {
        const name = `${what}-${duplicate}`;
        if (this[name]) {
            return this.timed(what, comment, duplicate + 1);
        }
        this[what] = {
            comment,
            startedAt: this.now
        };
        const end = () => {
            this[what].endedAt = this.now;
            this[what].duration = this[what].endedAt - this[what].startedAt;
        };
        return end;
    }
    setError(e) {
        this.errored = true;
        this.error = e;
        this.erroredAt = this.now;
    }
    message(...comments) {
        if (!this.messages) {
            this.messages = {};
        }
        this.messages[this.now.toISOString()] =
            comments.length > 1 ? comments : comments[0];
    }
    log() {
        // eslint-disable-next-line no-console
        console.log(this.toString());
    }
}
Logger.prototype.toString = function toString() {
    return clean(this);
};
exports.default = Logger;
//# sourceMappingURL=logger.js.map