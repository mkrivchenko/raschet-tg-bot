import { IConfigService } from './config/config.interface';
import { Scenes, Telegraf } from 'telegraf';
import { IBotContext } from './context/context.interface';
import LocalSession from 'telegraf-session-local';
import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { inject, injectable } from 'inversify';
import { ILogger } from './helpers/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import { AuthScene } from './scenes/auth.scene';

@injectable()
export class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];
	scenes: Scenes.BaseScene<IBotContext>[] = [];

	constructor(
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
		@inject(TYPES.ILogger) private logger: ILogger,
	) {
		this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));
		this.bot.use(
			new LocalSession({ database: 'session_db.json' }).middleware(),
		);

		const scene = new AuthScene(this.bot, this.logger).build();

		const stage = new Scenes.Stage<IBotContext>([scene]);
		this.bot.use(stage.middleware());
		this.bot.use((ctx, next) => {
			// we now have access to the the fields defined above
			ctx.session.isAuth ??= true;
			ctx.scene.session.mySceneData ??= '0';
			return next();
		});
		this.bot.on('message', (ctx) => {
			ctx.scene.enter('auth');
		});
	}

	init() {
		this.commands.push(new StartCommand(this.bot, this.logger));
		for (const command of this.commands) {
			command.handle();
		}

		// this.bot.on(message('text'), (ctx) => {
		// 	ctx.session.messageCount++;

		// 	if (ctx.session.isAuth === true) {
		// 		ctx.reply('Its AUTH Success');
		// 		// this.bot.hears('pass', (ctx: IBotContext) => {
		// 		// 	console.log('pass');
		// 		// });
		// 	} else {
		// 		console.log(ctx.update);

		// 		if (ctx.message.text == '1') {
		// 			ctx.session.isAuth = true;
		// 			ctx.reply('Auth succes');
		// 		} else {
		// 			ctx.reply('X - is not AUTH!');
		// 		}
		// 	}
		// });

		// this.bot.hears(/pass/, (ctx: IBotContext) => {
		// 	console.log('pass');
		// });

		try {
			this.bot.launch();
			this.logger.info('Bot is launch!');
		} catch (e) {
			this.logger.error(e);
		}
	}
}

// const bot = new Bot(new ConfigService(), logger);
// bot.init();
