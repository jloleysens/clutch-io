import { DocumentMetadata, ContainerData } from '../documents/common';

export interface CheckForAppUpdateDocumentJSON {
  hash: string;
  metadata: DocumentMetadata;
  container: ContainerData;
  deploymentId: string;
}
