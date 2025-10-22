# n8n-nodes-osint-industries

This package adds the OSINT Industries API to your n8n workflows. Use it to enrich email addresses and phone numbers or to monitor your remaining API credits without leaving your automation canvas.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

Follow the [official community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) to add the package to your n8n instance.

The npm package name is `n8n-nodes-osint-industries`.

## Operations

| Operation | Description |
|-----------|-------------|
| **Search** | Query the OSINT Industries data lake by email address or phone number. Optionally split the response into one item per module. |
| **Get Remaining Credits** | Retrieve the remaining credit balance for the authenticated account. |

## Credentials

1. Sign in to your [OSINT Industries](https://osint.industries/) account.
2. Generate an API key from the dashboard.
3. Create a new credential in n8n using the **OSINT Industries API** type and paste the key.

The credential test button issues a `/credits` call to verify the API key.

## Compatibility

- Requires n8n v1.50.0 or newer (tested with v1.50 and v1.71).
- Node runtime: requires network egress to `https://osint.industries`.

## Usage

### Search for an email or phone number

1. Add the **OSINT Industries** node to your workflow.
2. Choose the **Search** operation and select the identifier type (email or phone).
3. Provide the value to look up. Optionally adjust the timeout (1–60 seconds) and whether to split the output into multiple items (one per module) or keep a single aggregate item.
4. Execute the workflow to receive structured module data, including source reliability flags and platform-specific attributes.

### Check remaining credits

1. Add the **OSINT Industries** node and select the **Get Remaining Credits** operation.
2. Execute the workflow to retrieve the current credit balance.

## Resources

- [OSINT Industries API documentation](https://osint.industries/docs)
- [osint-industries-ts on npm](https://www.npmjs.com/package/osint-industries-ts)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

| Version | Changes |
|---------|---------|
| 0.1.0 | Initial release with search and credit operations. |
