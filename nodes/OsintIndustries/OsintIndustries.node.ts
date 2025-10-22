import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { OsintClient } from 'osint-industries-ts';

type SearchType = 'email' | 'phone';

export class OsintIndustries implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OSINT Industries',
		name: 'osintIndustries',
		icon: {
			light: 'file:osintIndustries.svg',
			dark: 'file:osintIndustries.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Search the OSINT Industries API',
		defaults: {
			name: 'OSINT Industries',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'osintIndustriesApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'search',
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search by email address or phone number',
						action: 'Search by identifier',
					},
					{
						name: 'Get Remaining Credits',
						value: 'getCredits',
						description: 'Retrieve the number of credits left on the account',
						action: 'Get remaining credits',
					},
				],
			},
			{
				displayName: 'Identifier Type',
				name: 'searchType',
				type: 'options',
				default: 'email',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'Phone', value: 'phone' },
				],
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				description: 'Select the identifier type to search',
			},
			{
				displayName: 'Identifier Value',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'name@example.com',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				description: 'Email address or phone number to search',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 60,
				},
				default: 10,
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				description: 'Number of seconds to wait for slow data sources before returning results',
			},
			{
				displayName: 'Split Result Items',
				name: 'splitModules',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				description:
					'Whether to return one item per module in the response. Disable to receive a single item with all modules embedded.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('osintIndustriesApi');

		if (!credentials?.apiKey) {
			throw new NodeOperationError(this.getNode(), 'No API key returned from credentials');
		}

		const client = new OsintClient({ apiKey: credentials.apiKey as string });

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const operation = this.getNodeParameter('operation', itemIndex) as 'search' | 'getCredits';

			try {
				if (operation === 'search') {
					const searchType = this.getNodeParameter('searchType', itemIndex) as SearchType;
					const query = this.getNodeParameter('query', itemIndex) as string;
					const timeout = this.getNodeParameter('timeout', itemIndex, 10) as number;
					const splitModules = this.getNodeParameter('splitModules', itemIndex, true) as boolean;

					const result = await client.search({
						type: searchType,
						query,
						timeout,
					});

					if (splitModules) {
						if (result.length === 0) {
							returnData.push({
								json: {
									query,
									type: searchType,
									module: null,
								},
								pairedItem: { item: itemIndex },
							});
						} else {
							for (const module of result) {
								returnData.push({
									json: {
										query,
										type: searchType,
										module,
									},
									pairedItem: { item: itemIndex },
								});
							}
						}
					} else {
						returnData.push({
							json: {
								query,
								type: searchType,
								modules: result,
							},
							pairedItem: { item: itemIndex },
						});
					}
				} else if (operation === 'getCredits') {
					const credits = await client.credits();

					returnData.push({
						json: { credits },
						pairedItem: { item: itemIndex },
					});
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
