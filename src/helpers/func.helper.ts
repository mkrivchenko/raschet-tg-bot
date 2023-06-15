import base64Converter from 'js-base64';

export function strToBase64URL(str: string) {
	return base64Converter.encode(str).replace('/', '-').replace('+', '_');
}
