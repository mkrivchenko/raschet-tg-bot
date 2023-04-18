import { Context } from 'telegraf';

export interface ISessionData {
	isAuth: boolean;
}

export interface IBotContext extends Context {
	session: ISessionData;
}
