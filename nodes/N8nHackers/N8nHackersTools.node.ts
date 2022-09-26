/**
 * Paso 1: Agregamos librerías
 */
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

/**
 * Paso 2: Creamos la clase principal del nodo
 */

export class N8nHackersTools implements INodeType {
	description: INodeTypeDescription = {
		/**
		 * Paso 3: Agregar detalles del nodo
		 */
		displayName: 'N8n Hackers Tools',
		name: 'N8nHackersTools',
		icon: 'file:n8nHackersTools.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use tools from N8n Hackers API',
		defaults: {
			name: 'N8n Hackers Tools',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [

		],
		requestDefaults: {
			baseURL: 'https://api.n8nhackers.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},

		/**
		 * Paso 4: Agregamos recursos del nodo
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Installer',
						value: 'installer',
						description: 'This installer allows to install multiple services in a server',
					},
				],
				default: 'installer',
			},

			/**
			 * Paso 5: Agregamos operaciones
			 */
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'installer',
						],
					},
				},
				options: [
					{
						name: 'Services',
						action: 'Get available services to install',
						description: 'Get available services to install',
						value: 'services',
						routing: {
							request: {
								method: 'GET',
								url: '/tools/installer/services',
							},
						},
					},
					{
						name: 'Service',
						action: 'Get service details',
						description: 'Get service details',
						value: 'service',
						routing: {
							request: {
								method: 'GET',
								url: '=/tools/installer/services/{{$parameter.service}}',
							},
						},
					},
				],
				default: 'services',
			},
			{
				displayName: 'Service',
				description: 'Choose which Service do you want to install',
				required: true,
				name: 'service',
				type: 'options',
				options: [
					{name: 'BaseRow', value: 'baserow'},
					{name: 'N8n', value: 'n8n'},
				],
				default: 'n8n',
				displayOptions: {
					show: {
						operation: [
							'service',
							'service_config',
							'service_compose',
						],
					},
				},
			},
		],
	};
}
