import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.interface';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { IBotContext } from './context/context.interface';
import LocalSession from 'telegraf-session-local';

class Bot {
	bot: Telegraf<IBotContext>;

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));
		this.bot.use(
			new LocalSession({ database: 'session_db.json' }).middleware(),
		);
	}

	init() {
		this.bot.start((ctx) => {
			ctx.session.isAuth = false;
		});
		this.bot.on(message('text'), (ctx: IBotContext) => {
			if (ctx.session.isAuth === true) {
				ctx.reply('Its AUTH Success');
			} else {
				ctx.reply('X - is not AUTH!');
			}
		});
		this.bot.launch();
	}
}

const bot = new Bot(new ConfigService());
bot.init();
