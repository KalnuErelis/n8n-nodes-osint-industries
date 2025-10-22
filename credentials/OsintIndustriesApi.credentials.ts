import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class OsintIndustriesApi implements ICredentialType {
	name = 'osintIndustriesApi';

	displayName = 'OSINT Industries API';

	icon: Icon = {
		light: 'file:osintIndustriesApi.light.svg',
		dark: 'file:osintIndustriesApi.dark.svg',
	};

	documentationUrl = 'https://github.com/KalnuErelis/n8n-nodes-osint-industries#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'You can generate an API key from the OSINT Industries dashboard.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://osint.industries/api',
			url: '/credits',
		},
	};
}
