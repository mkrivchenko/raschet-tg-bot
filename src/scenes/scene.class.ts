import { injectable } from 'inversify';
import { ILogger } from '../helpers/logger.interface';

@injectable()
export abstract class Scene {
	constructor(private loggerService: ILogger) {}

	abstract build(): void;
}
