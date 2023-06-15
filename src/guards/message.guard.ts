import Context from 'telegraf/typings/context';
import {
	CallbackQuery,
	Message,
	Update,
} from 'telegraf/typings/core/types/typegram';

export function isTextMessage(
	message: Message,
): message is Message.TextMessage {
	return 'text' in message;
}

export function isCallbackQueryData(
	callbackQuery: CallbackQuery,
): callbackQuery is CallbackQuery.DataQuery {
	return 'data' in callbackQuery;
}
