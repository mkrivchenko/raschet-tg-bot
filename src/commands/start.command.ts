import { Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../helpers/logger.interface';

@injectable()
export class StartCommand extends Command {
	constructor(
		@inject(TYPES.Bot) private botInstance: Telegraf<IBotContext>,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {
		super(botInstance, loggerService);
		this.loggerService.info('Command "Start" init');
	}

	handle(): void {
		this.botInstance.start((ctx) => {
			ctx.session.isAuth = false;
			// ctx.session.messageCount = 0;
			ctx.reply(`Hello, ${ctx.from.first_name}`);
			ctx.scene.enter('auth');
		});
	}
}
