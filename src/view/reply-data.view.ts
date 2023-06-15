import { msgServiceMenu } from '../helpers/reply-messages';

export function viewContractData(ctx: any, json: any) {
	ctx
		.reply(`Информация по адресу: ${json.address}
			Тариф: ${json.data.rate}
			Задолжность: ${json.data.debt}
			Дата монтажа: ${json.data.date_install}
			Дата пуска: ${json.data.date_start}
	`)
		.then(() => {
			ctx.reply(msgServiceMenu.message, msgServiceMenu.settings);
		});
}
