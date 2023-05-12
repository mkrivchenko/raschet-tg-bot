import { Scenes } from 'telegraf';

export interface ISceneContext extends Scenes.SceneSessionData {
	mySceneData: string;
}
