# Project Structure for AI Agents

This document provides an overview of the project structure, intended to be used by AI agents to understand the codebase and contribute to its development.

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
        -   `credentials/`: Contains the credentials for the Paperless NGX API.
        -   `tests/`: Contains the tests for the node.

## Key Files

-   `nodes/PaperlessNgx/PaperlessNgx.node.ts`: This is the entry point for the Paperless NGX node. It defines the node's properties, operations, and the `execute` method that orchestrates the calls to the operations.
-   `nodes/PaperlessNgx/operations/`: This directory contains the core logic for interacting with the Paperless NGX API. Each file corresponds to a specific operation that the node can perform.
-   `package.json`: Defines the project's dependencies and scripts.

## How to Contribute

When adding new features or fixing bugs, please follow these guidelines:

1.  **Add a new operation**: If you are adding a new operation, create a new file in the `nodes/PaperlessNgx/operations/` directory. This file should export a function that implements the logic for the new operation.
2.  **Update the node**: In `nodes/PaperlessNgx/PaperlessNgx.node.ts`, add the new operation to the `properties` array. Then, in the `execute` method, add a new `if` block to handle the new operation.
3.  **Add tests**: Create a new test file in the `nodes/PaperlessNgx/tests/` directory to test the new operation.
4.  **Update the README**: Update the `README.md` file to document the new feature.
