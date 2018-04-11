import { Service } from './Service';
import { GenericObject } from './common';

export interface DatabaseService extends Service {
  create(doc): Promise<boolean>;
  retrieve<T extends GenericObject>(doc): Promise<T | null>;
}
