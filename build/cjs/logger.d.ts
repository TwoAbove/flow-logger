import moment from 'moment';
declare class Logger {
    [key: string]: any;
    name: string;
    persistentId: string;
    version: string;
    errored?: boolean;
    error?: Error;
    erroredAt?: moment.Moment;
    messages?: {
        [key: string]: any;
    };
    constructor(config: {
        name: string;
        persistentId: string;
        version: string;
    });
    get now(): moment.Moment;
    timed(what: string, comment: string, duplicate?: number): () => void;
    setError(e: Error): void;
    message(...comments: any[]): void;
    log(): void;
}
export default Logger;
