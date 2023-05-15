import { Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Scene } from './scene.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../helpers/logger.interface';
import 'reflect-metadata';

@injectable()
export class AuthScene extends Scene {
	private scene: Scenes.BaseScene<IBotContext>;
	private password: RegExp;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
	) {
		super(logger);
		this.scene = new Scenes.BaseScene<IBotContext>('auth');
		this.password ??= /^1111/;
		this.logger.info('Scene "Auth" init');
	}

	public setPassword(password: string) {
		this.password = new RegExp(`^${password}`);
		return this;
	}

	public build() {
		this.scene.enter((ctx) => {
			ctx.reply('Чтобы продолжить, нужно авторизоваться. Введите пароль');
			this.logger.info(`${ctx.from?.username} enter to 'Auth' scene`);
		});

		this.scene.leave((ctx) => {
			ctx.reply('Bye');
			this.logger.info(`${ctx.from?.username} leave from 'Auth' scene`);
		});

		this.scene.hears(this.password, (ctx) => {
			ctx.reply('Auth success');
			ctx.session.isAuth = true;
			ctx.scene.leave();
		});

		this.scene.on('message', (ctx) => {
			ctx.reply('Пароль не верный. Введите пароль');
			this.logger.info(ctx.session);
		});

		return this.scene;
	}
}
