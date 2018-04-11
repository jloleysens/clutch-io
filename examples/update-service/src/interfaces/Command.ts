import { UpdateService } from "../UpdateService";
import { GenericObject } from "./common";
import { Logger } from 'loglevel';

export interface CommandResult {
  success: boolean;
}

export interface Command {
  fn: Function,
  logger: Logger;
}
