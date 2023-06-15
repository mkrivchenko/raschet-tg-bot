import { Markup } from 'telegraf';
import { IStandartMessage } from './reply-message.interface';
import { ActionTrigger } from '../actions/action-trigger.enum';
import { serviceSceneStates } from '../context/scene-context.interface';

export const msgMenu: IStandartMessage = {
	message: '\uD83D\uDCD2 \n Выберите категорию *меню*',
	settings: {
		parse_mode: 'MarkdownV2',
		reply_markup: {
			inline_keyboard: [
				[
					Markup.button.callback('\uD83D\uDC49 Сервис', ActionTrigger.Servise),
					Markup.button.callback('\uD83D\uDC49 Продажи', ActionTrigger.Sales),
				],
			],
		},
	},
};

// 👉 - \uD83D\uDC49
// 📒 - \uD83D\uDCD2

export const msgServiceMenu: IStandartMessage = {
	message: 'Получить данные можно по номеру договора, либо найти по адресу',
	settings: {
		parse_mode: 'MarkdownV2',
		reply_markup: {
			inline_keyboard: [
				[
					Markup.button.callback(
						'По номеру договора',
						serviceSceneStates.ByNumber,
					),
					Markup.button.callback(
						'По адресу объекта',
						serviceSceneStates.ByAddress,
					),
				],
				[Markup.button.callback('Выйти в основное меню', 'exit')],
			],
		},
	},
};

export const msgEnterContractNumber: IStandartMessage = {
	message: 'Введите номер договора',
};

export const msgEnterContractAddress: IStandartMessage = {
	message: 'Введите адрес объекта',
};
