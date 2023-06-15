import { Scenes } from 'telegraf';

export interface ISceneContext extends Scenes.SceneSessionData {
	mySceneData: string;
	sceneState: serviceSceneStates | '';
}

export enum serviceSceneStates {
	ByNumber = 'ContractByNumber',
	ByAddress = 'ContractByAddress',
}
