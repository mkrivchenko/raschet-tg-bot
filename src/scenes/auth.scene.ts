import { Scenes, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Scene } from './scene.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../helpers/logger.interface';
import 'reflect-metadata';

@injectable()
export class AuthScene extends Scene {
	constructor(
		@inject(TYPES.Bot) private botInstance: Telegraf<IBotContext>,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {
		super(botInstance, loggerService);

		this.loggerService.info('Scene "Auth" init');
	}

	handle(): void {
		throw new Error('Method not implemented.');
	}

	public build() {
		const { enter, leave } = Scenes.Stage;

		const authScene = new Scenes.BaseScene<IBotContext>('auth');
		authScene.enter((ctx) => ctx.reply('Hi'));
		authScene.leave((ctx) => ctx.reply('Bye'));
		authScene.hears('hi', enter<IBotContext>('auth'));
		authScene.on('message', (ctx) => {
			ctx.replyWithMarkdownV2('Send **hi**');
			this.loggerService.info(`enter to 'Auth' scene`);
			this.loggerService.info(ctx.scene);
			this.loggerService.info(ctx.session);
		});

		return authScene;
	}
}

// export class AuthStage {

// }
