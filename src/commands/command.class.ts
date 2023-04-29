import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { ILogger } from '../helpers/logger.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class Command {
	constructor(public bot: Telegraf<IBotContext>) {}

	abstract handle(): void;
}
