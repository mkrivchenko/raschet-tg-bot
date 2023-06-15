import axios from 'axios';

export async function getContractByNumber(contractNumberInBase64: string) {
	try {
		const response = await axios.get(
			`http://192.168.1.150:888/test/hs/bot-api/address/${contractNumberInBase64}`,
		);
		return response.data;
	} catch (e) {
		throw new Error();
	}
}

export async function getContractList(contractAddressInBase64: string) {
	try {
		const response = await axios.get(
			`http://192.168.1.150:888/test/hs/bot-api/address/list/${contractAddressInBase64}`,
		);
		return response.data;
	} catch (e) {
		throw new Error();
	}
}
