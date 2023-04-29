import { Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
		// bot.logger.info('Command "Start" init');
	}

	handle(): void {
		this.bot.start((ctx) => {
			ctx.session.isAuth = false;
			ctx.session.messageCount = 0;
			ctx.reply(`Hello, ${ctx.from.first_name}`);
		});
	}
}
