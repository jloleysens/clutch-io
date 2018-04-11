import { CommandResult } from '../interfaces/Command';
import { CheckForAppUpdateDocumentJSON } from '../interfaces/CheckForAppUpdateDocument';
import { PublishDocumentJSON } from '../interfaces/PublishDocument';
import { CheckForAppUpdateDocument } from '../documents/CheckForAppUpdateDocument';
import { Bundle } from '../documents/common';
import { UpdateService } from '../UpdateService';

import { Command } from '../../../../source';

import {
  AuthenticationFailedError,
  MalformedDocumentError
} from "../errors/common";
import { DeploymentNotFoundError } from "../errors/checkForAppUpdate";

import { verify } from 'jsonwebtoken';
import { hasRequired } from './utils';
import { Logger } from 'loglevel';

export interface CheckForAppUpdateCommandResult extends CommandResult {
  result: {
    updateAvailable: boolean;
    update?: {
      tag: string;
      bundle: Bundle[];
      label?: string;
    };
    updateContainer?: {
      openUrl: string;
    };
  };
}

export function* checkForAppUpdateCommand(json: CheckForAppUpdateDocumentJSON, updateService: UpdateService, logger: Logger) {
  logger.info('Starting command');
  const document = new CheckForAppUpdateDocument(json);
  await hasRequired(document);
  const publishedDoc = await updateService.databaseService.retrieve<PublishDocumentJSON>({
    deploymentId: document.deploymentId
  });
  if (publishedDoc) {
    try {
      await hasRequired(publishedDoc);
    } catch (e) {
      throw new MalformedDocumentError(e);
    }

    let updateAvailable,
      appUpdate = null,
      containerUpdate = null;
    if (publishedDoc.auth) {
      // Check JWT
    }

    updateAvailable = document.hash !== publishedDoc.hash;

    if (updateAvailable) {
      // TODO: Get signed AWS url for bundles...
      appUpdate = {
        tag: publishedDoc.tag,
        bundle: publishedDoc.bundle ? [...publishedDoc.bundle] : null,
        label: publishedDoc.label
      };
    }

    const result = Object.assign(
      {
        updateAvailable
      },
      appUpdate ? appUpdate : {},
      containerUpdate ? containerUpdate : {}
    );

    return {
      success: true,
      result
    };
  } else {
    return {
      success: false,
      result: {
        updateAvailable: false
      }
    };
  }
}

export default {
  fn: checkForAppUpdateCommand,
  doc: CheckForAppUpdateDocument
};
