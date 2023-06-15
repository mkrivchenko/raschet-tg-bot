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
import { msgMenu } from './helpers/reply-messages';
import { SceneEnter } from './scenes/scenes.enum';
import { ActionTrigger } from './actions/action-trigger.enum';
import { ServiseMenuScene } from './scenes/servise/servise-menu.scene';

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
		this.scenes.push(new ServiseMenuScene(this.logger).build());

		const stage = new Scenes.Stage<IBotContext>(this.scenes);
		this.bot.use(stage.middleware());
		this.bot.use((ctx, next) => {
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

		// debug code
		this.bot.hears('auth', (ctx) => {
			ctx.scene.enter(SceneEnter.Auth);
		});

		// debug code
		this.bot.hears('Меню', (ctx) => {
			ctx.reply(msgMenu.message, msgMenu.settings);
		});

		this.bot.action(ActionTrigger.Servise, (ctx) => {
			ctx.scene.enter(SceneEnter.ServiseMenu);
		});

		this.bot.action(ActionTrigger.Sales, (ctx) => {
			ctx.reply('Продажи');
		});

		try {
			this.bot.launch();
			this.logger.info('Bot is launch!');
		} catch (e) {
			this.logger.error(e);
		}
	}
}

// ctx.editMessageText('Сервис', {
// 	parse_mode: 'MarkdownV2',
// 	reply_markup: {
// 		inline_keyboard: [
// 			[Markup.button.callback('1', '1')],
// 			[Markup.button.callback('2', '2')],
// 			[Markup.button.webApp('WebApp', 'https://ya.ru')],
// 		],
// 	},
// });
