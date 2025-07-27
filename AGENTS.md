# Project Structure for AI Agents

This document provides an overview of the project structure, intended to help AI agents understand the codebase and contribute to its development.

## Directory Structure

The project is organized into the following main directories:

-   `nodes/`: Contains the source code for the n8n nodes.
    -   `PaperlessNgx/`: The main directory for the Paperless NGX node.
        -   `PaperlessNgx.node.ts`: The main file for the node, defining its properties and execution logic.
        -   `operations/`: Contains the functions that interact with the Paperless NGX API.
            -   `getCorrespondents.ts`: Implements the logic for retrieving all correspondents.
            -   `getDocumentsByTag.ts`: Implements the logic for retrieving documents by tag.
            -   `getTags.ts`: Implements the logic for retrieving all tags.
            -   `updateDocument.ts`: Implements the logic for updating a document.
        -   `credentials/`: Contains the credentials required to interact with the Paperless NGX API.
        -   `tests/`: Contains the tests for the node.

## Key Files

-   `nodes/PaperlessNgx/PaperlessNgx.node.ts`: This is the entry point for the Paperless NGX node. It defines the node's properties, operations, and the `execute` method, which orchestrates the calls to the operations.
-   `nodes/PaperlessNgx/operations/`: This directory contains the core logic for interacting with the Paperless NGX API. Each file corresponds to a specific operation that the node can perform.
-   `package.json`: Defines the project's dependencies and scripts.

## How to Contribute

When adding new features or fixing bugs, please follow these guidelines:

1. **Add a test**: Use existing tests as inspiration. Add your test in `nodes/PaperlessNgx/tests/`. Wait for a human to review and approve the test.
2. **Add the new operation**: Once approved, start working on the test's implementation. Create a new file in the `operations/` directory or update an existing one.
3. **Ensure tests pass**: Run the tests and ensure they pass before proceeding.
4. **Update the node**: Extend `nodes/PaperlessNgx/PaperlessNgx.node.ts` to support the new operation.
5. **Update documentation**: Update the `README.md`, `AGENTS.md`, and contributors files to reflect the changes.
