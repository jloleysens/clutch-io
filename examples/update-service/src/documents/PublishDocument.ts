import {
  IsAlphanumeric,
  IsString,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsOptional
} from "class-validator";

import {
  DocumentMetadata,
  ContainerData,
  Document,
  Bundle,
  UpdateContainer
} from "./common";

import { PublishDocumentJSON } from '../interfaces/PublishDocument'
import { isObject, isArray } from "util";

export class PublishDocument extends Document {
  constructor(
    {
      deploymentId,
      metadata,
      hash,
      auth,
      tag,
      label = null,
      bundle,
      updateContainer
    } = {} as PublishDocumentJSON
  ) {
    super();
    this.created = new Date();
    this.deploymentId = deploymentId;
    this.metadata = isObject(metadata) ? new DocumentMetadata(metadata) : null;
    this.hash = hash;
    this.auth = auth;
    this.tag = tag;
    this.label = label;
    this.bundle = isArray(bundle) ? bundle.map(b => new Bundle(b)) : null;
    this.updateContainer = isObject(updateContainer) ? new UpdateContainer(updateContainer) : null;
  }

  @IsDate()
  created: Date;

  @IsAlphanumeric()
  deploymentId: string;

  @ValidateNested()
  metadata: DocumentMetadata;

  @IsAlphanumeric()
  hash: string;

  @IsBoolean()
  auth: boolean;

  @IsAlphanumeric()
  tag: string;

  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @ValidateNested({ each: true })
  bundle: Bundle[];

  @IsOptional()
  @ValidateNested()
  updateContainer: UpdateContainer;
}
