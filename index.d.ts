import moment from 'moment';

declare namespace FlowLogger {
	class Logger {
		constructor(config: {
			name: string;
			persistentId: string;
			version: string;
		});

		get now(): moment.Moment;

		/**
		 * Stringifies the instance
		 */
		toString(): string;

		/**
		 * logs instance to console.log
		 */
		log(): void;

		/**
		 * Adds a timed message
		 * @param comments
		 */
		message(...comments: any[]): void;

		/**
		 * Contains all of the messages that were logged, sorted by the date
		 */
		messages?: {
			[key: string]: any;
		};

		/**
		 * Log an error. Sets the Logger instance to errored
		 * @param e
		 */
		setError(e: Error): void;

		/**
		 * Adds a timed event with a callback
		 * @param what Name of the timed event
		 * @param comment Description of the timed event
		 * @returns Function to end timed
		 */
		timed(what: string, comment: string): () => void;

		errored?: boolean;
		error?: Error;
		erroredAt?: moment.Moment;
	}
}

export = FlowLogger.Logger;
