import { Logger, pino } from 'pino';
import PinoPretty from 'pino-pretty';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger;

	constructor() {
		const pretty = PinoPretty({
			colorize: true,
			translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
		});

		this.logger = pino(pretty);
	}

	info(...args: unknown[]): void {
		this.logger.info(args[0]);
	}

	error(...args: unknown[]): void {
		this.logger.error(args[0]);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(args[0]);
	}
}
