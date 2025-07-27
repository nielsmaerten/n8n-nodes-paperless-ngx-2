# n8n-nodes-paperless-ngx

![Screenshot](./screenshot.png)

This is an n8n community node package for [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx), an open-source document management system that transforms your physical documents into a searchable online archive.

This node allows you to automate your document workflows by connecting Paperless-ngx with other applications and services in your n8n workflows.

## Features

*   **Get Documents**: Retrieve a list of documents from your Paperless-ngx instance. Optionally filtered by tag(s).
*   **Update Document**: Update a document's title, add tags, or remove tags.

## Prerequisites

*   An n8n instance.
*   A Paperless-ngx instance.

## Installation

1.  Go to **Settings > Community Nodes** in your n8n instance.
2.  Click **Install** and enter `n8n-nodes-paperless-ngx`.
3.  Click **Install** again to confirm.

## Getting started

To use this node, you'll need to create a new credential for your Paperless-ngx instance.

1.  Go to **Credentials > New** in your n8n instance.
2.  Search for **Paperless-ngx** and select it.
3.  Enter your Paperless-ngx URL and API key.
4.  Click **Save**.

## Contributing

Contributions to this project are welcome! Please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/nielsmaerten/n8n-nodes-paperless-ngx).



## License

This project is licensed under the [MIT License](LICENSE.md).