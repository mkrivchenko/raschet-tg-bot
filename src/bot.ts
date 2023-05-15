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

		// TODO: Заменить на Redis
		this.bot.use(
			new LocalSession({ database: 'session_db.json' }).middleware(),
		);

		this.scenes.push(
			new AuthScene(this.logger)
				.setPassword(this.configService.get('PASSWORD'))
				.build(),
		);

		const stage = new Scenes.Stage<IBotContext>(this.scenes);
		this.bot.use(stage.middleware());
		this.bot.use((ctx, next) => {
			// we now have access to the the fields defined above
			ctx.session.isAuth ??= false;
			ctx.scene.session.mySceneData ??= '0';
			return next();
		});
	}

	init() {
		this.commands.push(new StartCommand(this.bot, this.logger));
		for (const command of this.commands) {
			command.handle();
		}

		this.bot.hears('auth', (ctx) => {
			ctx.scene.enter('auth');
		});

		try {
			this.bot.launch();
			this.logger.info('Bot is launch!');
		} catch (e) {
			this.logger.error(e);
		}
	}
}
