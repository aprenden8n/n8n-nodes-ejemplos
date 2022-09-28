/**
 * Inicio Paso 1: Agregamos los imports necesarios
 */
import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { OptionsWithUri } from 'request';
/**
 * Fin Paso 1: Agregamos los imports necesarios
 */


/**
 * Inicio Paso 2: Creamos la clase principal del nodo
 */
export class VirusTotal implements INodeType {
	description: INodeTypeDescription = {
		/**
		 * Inicio Paso 3: Agregamos los detalles del nodo
		 */
		displayName: 'Virus Total',
		name: 'virusTotal',
		icon: 'file:virusTotal.svg',
		group: ['security'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume VirusTotal API',
		defaults: {
			name: 'VirusTotal',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'virusTotalApi',
				required: true,
			},
		],
		/**
		 * Fin Paso 3
		 */

		properties: [
			/**
			 * Inicio Paso 4: Agregamos el recurso: Domain
			 *
			 */
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Domain',
						value: 'domain',
					},
				],
				default: 'domain',
				noDataExpression: true,
				required: true,
				description: 'Check a domain',
			},
			/**
			 * Fin Paso 4
			 */

			/**
			 * Inicio Paso 5: Agregamos la operación: Get Report
			 * Referencia: https://developers.virustotal.com/reference/domain-info
			 */
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				options: [
					{
						name: 'Report',
						value: 'domain-info',
						description: 'Get a domain report',
						action: 'Get a domain report',
					},
				],
				default: 'domain-info',
				noDataExpression: true,
			},
			/**
			 * Fin Paso 5
			 */

			/**
			 * Paso 6: Agregamos el parámetro Domain de la operación: Get Report
			 */
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['domain-info'],
					},
				},
				default: '',
				placeholder: 'aprenden8n.com',
				description: 'Domain to get a report',
			},
			/**
			 * Fin Paso 6
			 */

			/**
			 * Paso 7: Agregamos los parámetros opcionales.
			 * Limitamos la salida a las propiedades que nos interesan
			 */
			 {
				displayName: 'Limit Output',
				name: 'limitOutput',
				type: 'boolean',
				default: false,
				description: 'Whether to limit JSON output to only the properties that are used in the node',
				displayOptions: {
					show: {
						operation: ['domain-info'],
						resource: ['domain'],
					},
				},
			},

			 {
				displayName: 'Type',
				name: 'type',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['domain-info'],
						resource: ['domain'],
						limitOutput: [true],
					},
				},
				placeholder: 'Attribute to get',
				description: 'Attribute to get',
				options: [
					{
						name: 'Last Dns Records',
						value: 'last_dns_records',
					},
					{
						name: 'Whois',
						value: 'whois',
					},
				],
				default: 'last_dns_records',
			},
		],
	};

	/**
	 * Paso 8: Agregamos el método de ejecución del nodo
	 * @param this
	 * @returns
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Obtenemos los datos de entrada
		const items = this.getInputData();
		let responseData;
		const returnData = [];

		// Obtenemos los parámetros del nodo
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		//Para todos los items de la entrada
		for (let i = 0; i < items.length; i++) {
			if (resource === 'domain') {
				if (operation === 'domain-info') {
					// Get email input
					const domain = this.getNodeParameter('domain', i) as string;
					const limitOutput = this.getNodeParameter('limitOutput', i) as boolean || false;

					const options: OptionsWithUri = {
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						uri: `https://www.virustotal.com/api/v3/domains/${domain}`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'virusTotalApi',
						options,
					);

					// Si limitamos la sa
					if (limitOutput) {
						// Recuperar type si se quiere limitar la salida
						const type = this.getNodeParameter('type', i) as string || '';
						if (type && type.length && responseData.data.attributes[type]) {
							responseData = {
								output: responseData.data.attributes[type],
							};
						}
					}

					returnData.push(responseData);
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
