import { Context, Scenes } from 'telegraf';
import { ISceneContext } from './scene-context.interface';

export interface ISessionData extends Scenes.SceneSessionData {
	isAuth: boolean;
	messageCount: number;
	__scenes: any;
}

export interface IBotContext extends Context {
	session: ISessionData;

	scene: Scenes.SceneContextScene<IBotContext, ISceneContext>;
}
