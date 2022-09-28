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
		name: 'n8nHackersTools',
		icon: 'file:n8nHackersTools.svg',
		group: ['utility'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use tools from N8n Hackers API',
		defaults: {
			name: 'N8n Hackers Tools',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'n8nHackersToolsApi',
				required: true,
			 },
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
					{
						name: 'Integrator',
						value: 'integrator',
						description: 'This integrator allows to convert any curl expression to an HTTP request node',
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
			/**
			 * Paso 6: Agregamos los parámetros de las operaciones
			 */
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
						],
					},
				},
			},
			/**
			 * Paso 6: Agregamos los parámetros de las operaciones adicionales
			 */
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'integrator',
						],
					},
				},
				options: [
					{
						name: 'Generate',
						action: 'Generate an HTTP request node using a CURL expression',
						description: 'Generate an HTTP request node using a CURL expression',
						value: 'generate',
						routing: {
							request: {
								method: 'POST',
								url: '/tools/integrator',
								body: {
									curl: '={{$parameter.curl}}',
								},
							},
						},
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Curl Expression',
				description: 'Define curl expression to convert to HTTP request node',
				required: true,
				name: 'curl',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						resource: [
							'integrator',
						],
						operation: [
							'generate',
						],
					},
				},
			},
		],
	};
}
