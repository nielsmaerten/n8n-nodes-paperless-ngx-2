import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { getDocumentsByTag } from './operations/getDocumentsByTag';
import { updateDocument } from './operations/updateDocument';

export class PaperlessNgx implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Paperless NGX',
    name: 'paperlessNgx',
    icon: 'file:paperless-ngx.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with Paperless NGX',
    defaults: {
      name: 'Paperless NGX',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'paperlessNgxApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Documents',
            value: 'getDocuments',
            action: 'Get documents',
          },
          {
            name: 'Update Document',
            value: 'updateDocument',
            action: 'Update a document',
          },
        ],
        default: 'getDocuments',
      },
      // Properties for "Get Documents"
      {
        displayName: 'Tags',
        name: 'tag',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags. Leave empty to get all documents.',
        displayOptions: {
          show: {
            operation: ['getDocuments'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
        displayOptions: {
          show: {
            operation: ['getDocuments'],
          },
        },
      },
      // Properties for "Update Document"
      {
        displayName: 'Document ID',
        name: 'documentId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: {
            operation: ['updateDocument'],
          },
        },
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['updateDocument'],
          },
        },
      },
      {
        displayName: 'Add Tags',
        name: 'addTags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags to add',
        displayOptions: {
          show: {
            operation: ['updateDocument'],
          },
        },
      },
      {
        displayName: 'Remove Tags',
        name: 'removeTags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags to remove',
        displayOptions: {
          show: {
            operation: ['updateDocument'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const operation = this.getNodeParameter('operation', 0, '') as string;
    const credentials = await this.getCredentials('paperlessNgxApi');

    process.env.PAPERLESS_NGX_URL = credentials.url as string;
    process.env.PAPERLESS_NGX_TOKEN = credentials.apiToken as string;

    let returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        if (operation === 'getDocuments') {
          const tagsStr = this.getNodeParameter('tag', i, '') as string;
          const tags = tagsStr ? tagsStr.split(',').map((tag) => tag.trim()) : [];
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const result = await getDocumentsByTag(tags, limit);
          returnData = result.documents.map((doc) => ({ json: doc }));
        } else if (operation === 'updateDocument') {
          const documentId = this.getNodeParameter('documentId', i, 0) as number;
          const title = this.getNodeParameter('title', i, '') as string;
          const addTagsStr = this.getNodeParameter('addTags', i, '') as string;
          const removeTagsStr = this.getNodeParameter('removeTags', i, '') as string;

          const updateData: {
            title?: string;
            tags?: string[];
            removeTags?: string[];
          } = {};

          if (title) {
            updateData.title = title;
          }

          if (addTagsStr) {
            updateData.tags = addTagsStr.split(',').map((tag) => tag.trim());
          }

          if (removeTagsStr) {
            updateData.removeTags = removeTagsStr.split(',').map((tag) => tag.trim());
          }

          const updatedDocument = await updateDocument(documentId, updateData);
          returnData.push({ json: updatedDocument });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          items.push({ json: this.getInputData(i)[0].json, error, pairedItem: i });
        } else {
          if (error.context) {
            error.context.itemIndex = i;
            throw error;
          }
          throw new NodeOperationError(this.getNode(), error, {
            itemIndex: i,
          });
        }
      }
    }

    return [returnData];
  }
}
