## Development

All features related to paperless-ngx are located in:  
`nodes/PaperlessNgx/operations`

The n8n node is defined in `PaperlessNgx.node.ts`, but it is only a **wrapper**. Keep logic inside the node itself to a minimum.

This lets us develop the Paperless-ngx functionality in isolation, with full test coverage:

### Testing

This project uses [Vitest](https://vitest.dev/) for unit testing. The test suite includes integration tests that make **real** HTTP requests to a Paperless-ngx instance.

#### Environment Variables

The tests require access to a real Paperless-ngx instance. Set the following environment variables:

*   `PAPERLESS_URL`: The URL of your Paperless-ngx instance (defaults to `http://localhost:8000`)
*   `PAPERLESS_TOKEN`: Your Paperless-ngx API token (defaults to `test-token`)

If you place a `.env` file into the repo root, Vitest will automatically pick it up.

#### Running Tests

```bash
npm test

# Run tests with custom Paperless instance
PAPERLESS_URL=http://your-paperless-instance.com PAPERLESS_TOKEN=your-api-token npm run test:run
```

**Note**: The integration tests will make real API calls to your Paperless-ngx instance. They primarily test with non-existent tag names to avoid affecting your actual data, but ensure you're comfortable with tests running against your instance.

#### Testing with n8n

You can run a local development instance of n8n to test your work in real-time.

This is highly recommended. Refer to: https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/

```bash
# Build & link the repo
npm run build
npm link

# Start n8n dev environment
cd ~/.n8n/custom
npm init -y
npm link n8n-nodes-paperless-ngx
n8n start # Note: no hot reloading AFAIK. Restart to see changes
```