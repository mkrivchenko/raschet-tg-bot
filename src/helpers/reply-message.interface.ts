import {
	InlineKeyboardMarkup,
	ParseMode,
} from 'telegraf/typings/core/types/typegram';

export interface IStandartMessage {
	message: string;
	settings?: {
		parse_mode: ParseMode;
		reply_markup: InlineKeyboardMarkup;
	};
}
