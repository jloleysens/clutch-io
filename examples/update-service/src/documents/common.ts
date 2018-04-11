import { IsBoolean, IsString, IsNumber, IsUrl, IsAlphanumeric } from 'class-validator';
import { GenericObject } from '../interfaces/common';

type Constructor<T = {}> = {new(): T};

export abstract class Document {
  static readonly _createdField = 'created';

  toJSON() {
    const createdToString = {};
    createdToString[Document._createdField] = this[Document._createdField].toString();
    return Object.assign({}, this, createdToString);
  }

  static fromJSON<T extends Document>(ctor: Constructor, json: GenericObject): T {
    const instance = Object.create(ctor.prototype);
    return Object.assign(instance, json);
  }

  static createdStamp() {
    const propDesc = {};
    propDesc[Document._createdField] = new Date();
    return propDesc;
  }
}

export class DocumentMetadata {
  constructor({test}) {
    this.test = test;
  }
  @IsBoolean()
  test: boolean;
}

export class ContainerData {
  constructor({version, bundleId, platform, platformVersion, arch, features}) {
    this.version = version;
    this.bundleId = bundleId;
    this.platform = platform;
    this.platformVersion = platformVersion;
    this.arch = arch;
    this.features = features;
  }

  @IsString()
  version: string;

  @IsString()
  bundleId: string;

  @IsString()
  platform: string;

  @IsString()
  platformVersion: string;

  @IsString()
  arch: string;

  @IsString({each: true})
  features: string[];
}

export class Bundle {
  constructor({
    url,
    location,
    size,
    hash,
  }) {
    this.url = url;
    this.location = location;
    this.size = size;
    this.hash = hash;
  }
  @IsUrl()
  url: string;

  @IsString()
  location: string;

  @IsNumber()
  size: number;

  @IsAlphanumeric()
  hash: string;
}

export class UpdateContainer {
  constructor({openUrl}) {
    this.openUrl = openUrl;
  }
  @IsUrl()
  openUrl: string;
}
