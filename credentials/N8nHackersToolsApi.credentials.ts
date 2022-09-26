
/**
 * Paso 7: Definimos la autenticación de la API de N8n Hackers
 */
import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class N8nHackersToolsApi implements ICredentialType {
	name = 'n8nHackersToolsApi';
	displayName = 'N8n Hackers Tools API';
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
				'apikey': '={{$credentials.apiKey}}',
			},
		},
	};
}
