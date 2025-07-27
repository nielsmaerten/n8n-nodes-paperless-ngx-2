## Development

All features related to paperless-ngx are found in `nodes/PaperlessNgx/operations`. The n8n node is merely a wrapper around these functions. This allows for developing and testing the paperless-ngx code with high-cohesion & low-coupling.

### Testing

This project uses [Vitest](https://vitest.dev/) for unit testing. The test suite includes integration tests that make real HTTP requests to a Paperless-ngx instance.

#### Environment Variables

The tests require access to a real Paperless-ngx instance. Set the following environment variables:

*   `PAPERLESS_URL`: The URL of your Paperless-ngx instance (defaults to `http://localhost:8000`)
*   `PAPERLESS_TOKEN`: Your Paperless-ngx API token (defaults to `test-token`)

#### Running Tests

```bash
npm test

# Run tests with custom Paperless instance
PAPERLESS_URL=http://your-paperless-instance.com PAPERLESS_TOKEN=your-api-token npm run test:run
```

**Note**: The integration tests will make real API calls to your Paperless-ngx instance. They primarily test with non-existent tag names to avoid affecting your actual data, but ensure you're comfortable with tests running against your instance.

#### Test Structure

*   **Integration Tests**: Located in `nodes/PaperlessNgx/operations/`
*   Tests validate API communication, error handling, and parameter processing

#### Testing with n8n

Refer to: https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/

```bash
# Build the project
npm run build

# Link the package
npm link
```