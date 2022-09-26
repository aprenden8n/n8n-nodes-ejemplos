
/**
 * Paso 9: Definimos la autenticación de la API de VirusTotal
 */
import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VirusTotalApi implements ICredentialType {
	name = 'virusTotalApi';
	displayName = 'VirusTotal API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-apikey': '{{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.virustotal.com/api/v3',
			url: '/domains',
		},
	};
}
