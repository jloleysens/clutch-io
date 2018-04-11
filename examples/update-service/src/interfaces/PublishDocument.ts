import { DocumentMetadata, ContainerData, Bundle } from '../documents/common';

export interface PublishDocumentJSON {
  label?: string;
  deploymentId: string;
  metadata: DocumentMetadata;
  hash: string;
  bundle?: Bundle[];
  updateContainer?: {
    openUrl: string;
  }
  auth: boolean;
  tag: string;
};
