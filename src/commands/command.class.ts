import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { injectable } from 'inversify';
import { ILogger } from '../helpers/logger.interface';

@injectable()
export abstract class Command {
	constructor(private bot: Telegraf<IBotContext>, private logger: ILogger) {}

	abstract handle(): void;
}
