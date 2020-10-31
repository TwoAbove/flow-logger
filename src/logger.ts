import moment from 'moment';
import { stringify as decircuralize } from 'circular-json';

const replace = (key: string, value: any) => {
	if (moment.isMoment(value)) {
		return value.toISOString();
	}
	if (value instanceof Error) {
		const error = {};
		Object.getOwnPropertyNames(value).forEach(k => {
			(error as any)[k] = (value as any)[k];
		});
		return error;
	}
	if (value && value.type === 'Buffer') {
		return Buffer.from(value.data).toString('base64');
	}
	return value;
};

const clean = (json: any) => decircuralize(json, replace, null, true);

class Logger {
	[key: string]: any
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
	}) {
		this.name = config.name;
		this.persistentId = config.persistentId;
		this.version = config.version;
	}

	get now() {
		return moment();
	}

	timed(what: string, comment: string, duplicate = 1): () => void {
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

	setError(e: Error): void {
		this.errored = true;
		this.error = e;
		this.erroredAt = this.now;
	}

	message(...comments: any[]): void {
		if (!this.messages) {
			this.messages = {};
		}
		this.messages[this.now.toISOString()] =
			comments.length > 1 ? comments : comments[0];
	}

	log(): void {
		// eslint-disable-next-line no-console
		console.log(this.toString());
	}
}

Logger.prototype.toString = function toString() {
	return clean(this);
};

export default Logger;
