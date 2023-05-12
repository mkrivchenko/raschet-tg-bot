import { injectable } from 'inversify';
import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { ILogger } from '../helpers/logger.interface';

@injectable()
export abstract class Scene {
	constructor(private bot: Telegraf<IBotContext>, private logger: ILogger) {}

	abstract handle(): void;
}
