import { publishCommand, PublishCommandResult } from './commands/publishCommand';
import { checkForAppUpdateCommand, CheckForAppUpdateCommandResult } from './commands/checkForAppUpdateCommand';
import { DatabaseService } from './services/DatabaseService';
import { Command } from './interfaces/Command';
import { PublishDocumentJSON } from './interfaces/PublishDocument';
import { CheckForAppUpdateDocumentJSON } from './interfaces/CheckForAppUpdateDocument';
import { provisionLogger } from './provisionLogger';

import 'reflect-metadata';

type UpdateServiceConfig = {databaseService?: DatabaseService};

export class UpdateService {
  public databaseService: DatabaseService;

  private commands: {[key: string]: Command};

  static async create(config: UpdateServiceConfig) {
    const i = new UpdateService(config);
    i.registerCommand(publishCommand);
    i.registerCommand(checkForAppUpdateCommand);
    await i.startup();
    return i;
  }

  constructor({databaseService}: UpdateServiceConfig) {
    this.commands = Object.create(null);
    this.databaseService = databaseService ? databaseService : new DatabaseService();
  }


  async publish(json: PublishDocumentJSON) {
    return await this.dispatch<PublishDocumentJSON, PublishCommandResult>(this.commands['publishCommand'], json);
  }

  async checkForAppUpdate(json: CheckForAppUpdateDocumentJSON) {
    return await this.dispatch<CheckForAppUpdateDocumentJSON, CheckForAppUpdateCommandResult>(this.commands['checkForAppUpdateCommand'], json);
  }

  async startup() {
    await this.databaseService.initialize();
  }

  private registerCommand(fn: Function) {
    this.commands[fn.name] = {
      fn,
      logger: provisionLogger(fn.name, process.env.LOG_LEVEL as any || 'INFO'),
    };
  }

  private async dispatch<D, R>(cmd: Command, json: D): Promise<R> {
    return await cmd.fn.apply(null, [json, this, cmd.logger]);
  }
}
