import { inject, injectable } from 'inversify';
import { Scene } from '../scene.class';
import { Markup, Scenes } from 'telegraf';
import { IBotContext } from '../../context/context.interface';
import { ILogger } from '../../helpers/logger.interface';
import { TYPES } from '../../types';
import { SceneEnter } from '../scenes.enum';
import {
	msgEnterContractAddress,
	msgEnterContractNumber,
	msgMenu,
	msgServiceMenu,
} from '../../helpers/reply-messages';
import { serviceSceneStates } from '../../context/scene-context.interface';
import { getContractByNumber, getContractList } from '../../api/one-c.api';
import { strToBase64URL } from '../../helpers/func.helper';
import { isCallbackQueryData, isTextMessage } from '../../guards/message.guard';
import { viewContractData } from '../../view/reply-data.view';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

@injectable()
export class ServiseMenuScene extends Scene {
	private scene: Scenes.BaseScene<IBotContext>;
	private contractNumberPattern = new RegExp(/\w+[1-9]/);

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
	) {
		super(logger);
		this.scene = new Scenes.BaseScene<IBotContext>(SceneEnter.ServiseMenu);
		this.logger.info('Scene "ServiseMenu" init');
	}

	build(): Scenes.BaseScene<IBotContext> {
		this.scene.enter((ctx) => {
			ctx.editMessageText(msgServiceMenu.message, msgServiceMenu.settings);
			this.logger.info(`${ctx.from?.username} enter to 'Servise' scene`);
		});

		// TODO: Refactoring that?
		this.scene.leave((ctx) => {
			ctx.deleteMessage();
			ctx.reply(msgMenu.message, msgMenu.settings);
			this.logger.info(`${ctx.from?.username} leave from 'Servise' scene`);
		});

		this.scene.action('exit', (ctx) => {
			ctx.scene.leave();
		});

		this.scene.action(serviceSceneStates.ByNumber, (ctx) => {
			ctx.scene.session.sceneState = serviceSceneStates.ByNumber;
			ctx.answerCbQuery();
			ctx.editMessageText(msgEnterContractNumber.message);
		});

		this.scene.action(serviceSceneStates.ByAddress, (ctx) => {
			ctx.scene.session.sceneState = serviceSceneStates.ByAddress;
			ctx.answerCbQuery();
			ctx.editMessageText(msgEnterContractAddress.message);
		});

		this.scene.action(this.contractNumberPattern, async (ctx) => {
			const callbackQuery = ctx.update.callback_query;
			if (isCallbackQueryData(callbackQuery)) {
				// TODO: Refacroing that
				const json = await getContractByNumber(
					strToBase64URL(callbackQuery.data),
				);
				viewContractData(ctx, json);
			}
		});
		// debug code
		this.scene.hears('Меню', (ctx) => {
			ctx.scene.leave();
		});

		this.scene.on('message', async (ctx) => {
			const msg = ctx.update.message;
			const sceneState = ctx.scene.session.sceneState;

			if (isTextMessage(msg)) {
				switch (sceneState) {
					case serviceSceneStates.ByAddress: {
						const json = await getContractList(strToBase64URL(msg.text));
						this.logger.info(json);

						// TODO: Refactoring that?
						const buttons: InlineKeyboardButton.CallbackButton[][] = [];
						json.Contracts.forEach((element: { name: string; id: string }) =>
							buttons.push([Markup.button.callback(element.name, element.id)]),
						);

						ctx.reply('Запрос на сервер по адресу', {
							parse_mode: 'MarkdownV2',
							reply_markup: { inline_keyboard: buttons },
						});
						// .then(() => {
						// 	ctx.reply(msgServiceMenu.message, msgServiceMenu.settings);
						// });
						break;
					}

					case serviceSceneStates.ByNumber: {
						const json = await getContractByNumber(strToBase64URL(msg.text));
						viewContractData(ctx, json);
						break;
					}
					default:
						return;
				}
			}
		});

		return this.scene;
	}
}
