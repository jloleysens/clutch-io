import { CommandResult } from "../interfaces/Command";
import { PublishDocumentJSON } from "../interfaces/PublishDocument";
import { hasRequired } from "./utils";
import { PublishDocument } from "../documents/PublishDocument";
import { UpdateService } from "../UpdateService";
import { UpdateContainer } from "../documents/common";
import { Logger } from "loglevel";

export interface PublishCommandResult extends CommandResult {}

export async function publishCommand(json: PublishDocumentJSON, updateService: UpdateService, logger: Logger): Promise<PublishCommandResult> {
  logger.info('Starting command');
  const document = new PublishDocument(json);
  await hasRequired<PublishDocument>(document);
  const result = await updateService.databaseService.create(document.toJSON());
  return { success: result };
}
