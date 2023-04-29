import { Container } from 'inversify';
import { ILogger } from './helpers/logger.interface';
import { LoggerService } from './helpers/logger.service';
import { TYPES } from './types';
import { Bot } from './bot';
import { ConfigService } from './config/config.service';
import 'reflect-metadata';

// async function bootstrap() {
const botContainer = new Container();

botContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
botContainer.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
botContainer.bind<Bot>(TYPES.Bot).to(Bot);

const bot = botContainer.get<Bot>(TYPES.Bot);
bot.init();
// }

// bootstrap();
