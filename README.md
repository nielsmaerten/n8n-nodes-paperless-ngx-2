# n8n-nodes-paperless-ngx

This is an n8n community node package for [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx), an open-source document management system that transforms your physical documents into a searchable online archive.

This node allows you to automate your document workflows by connecting Paperless-ngx with other applications and services in your n8n workflows.

## Features

*   **Get Documents**: Retrieve a list of documents from your Paperless-ngx instance. You can filter by tags (comma-separated) and limit the number of results.
*   **Update Document**: Update a document's title, add tags, or remove tags.

## Prerequisites

*   An n8n instance.
*   A Paperless-ngx instance.

## Installation

1.  Go to **Settings > Community Nodes** in your n8n instance.
2.  Click **Install** and enter `n8n-nodes-paperless-ngx`.
3.  Click **Install** again to confirm.

## Configuration

To use this node, you'll need to create a new credential for your Paperless-ngx instance.

1.  Go to **Credentials > New** in your n8n instance.
2.  Search for **Paperless-ngx** and select it.
3.  Enter your Paperless-ngx URL and API key.
4.  Click **Save**.

## Usage

Once you've configured your credentials, you can use the Paperless-ngx node in your workflows.

1.  Add the **Paperless-ngx** node to your workflow.
2.  Select the operation you want to perform (e.g., **Get Documents** or **Update Document**).
3.  Configure the node's parameters.
    *   For **Get Documents**, you can specify tags (comma-separated) and a limit.
    *   For **Update Document**, you need to provide the Document ID and can optionally provide a new title, tags to add, and tags to remove.
4.  Connect the node to other nodes in your workflow to build your automation.

## Contributing

Contributions to this project are welcome! Please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/nielsmaerten/n8n-nodes-paperless-ngx).

## Development

### Testing

This project uses [Vitest](https://vitest.dev/) for unit testing. The test suite includes integration tests that make real HTTP requests to a Paperless-ngx instance.

#### Environment Variables

The tests require access to a real Paperless-ngx instance. Set the following environment variables:

*   `PAPERLESS_URL`: The URL of your Paperless-ngx instance (defaults to `http://localhost:8000`)
*   `PAPERLESS_TOKEN`: Your Paperless-ngx API token (defaults to `test-token`)

#### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with custom Paperless instance
PAPERLESS_URL=http://your-paperless-instance.com PAPERLESS_TOKEN=your-api-token npm run test:run
```

**Note**: The integration tests will make real API calls to your Paperless-ngx instance. They primarily test with non-existent tag names to avoid affecting your actual data, but ensure you're comfortable with tests running against your instance.

#### Test Structure

*   **Integration Tests**: Located in `nodes/PaperlessNgx/operations/`
*   Tests validate API communication, error handling, and parameter processing
*   No mocks are used - tests make real HTTP requests to verify functionality

#### Building

```bash
# Build the project
npm run build

# Build and watch for changes
npm run dev
```

## License

This project is licensed under the [MIT License](LICENSE.md).