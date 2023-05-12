import 'reflect-metadata';
import { Container } from 'inversify';
import { ILogger } from './helpers/logger.interface';
import { LoggerService } from './helpers/logger.service';
import { TYPES } from './types';
import { Bot } from './bot';
import { ConfigService } from './config/config.service';
import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { AuthScene } from './scenes/auth.scene';
import { Scene } from './scenes/scene.class';

const botContainer = new Container();

/**
 * Регистрируем Логгер
 * @interface ILogger
 */
botContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);

/**
 * Регистрируем конфиг
 */
botContainer.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);

/**
 * Регистрируем команды
 * @abstract Command
 */
botContainer.bind<Command>(TYPES.StartCommand).to(StartCommand);

/**
 * Регистрируем сцены
 * @abstract Scene
 */
botContainer.bind<Scene>(TYPES.SceneBuilder).to(AuthScene);

/**
 * Регистрируем Бота
 */
botContainer.bind<Bot>(TYPES.Bot).to(Bot);

/**
 * Получаем бота из контейнера
 */
const bot = botContainer.get<Bot>(TYPES.Bot);
bot.init();
