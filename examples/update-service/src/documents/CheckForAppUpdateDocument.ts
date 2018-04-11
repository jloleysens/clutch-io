import {
  IsAlphanumeric,
  IsString,
  IsDate,
  ValidateNested,
  IsOptional
} from "class-validator";
import { Document, ContainerData, DocumentMetadata } from './common'

export class CheckForAppUpdateDocument extends Document {
  constructor({ hash, metadata, deploymentId, container }) {
    super();
    this.created = new Date();
    this.hash = hash;
    this.metadata = metadata ? new DocumentMetadata(metadata) : null;
    this.deploymentId = deploymentId;
    this.container = container ? new ContainerData(container) : null;
  }

  @IsDate()
  created: Date;

  @IsAlphanumeric()
  hash: string;

  @IsOptional()
  @ValidateNested()
  container: ContainerData;

  @IsOptional()
  @ValidateNested()
  metadata: DocumentMetadata;

  @IsString()
  deploymentId: string;
}
