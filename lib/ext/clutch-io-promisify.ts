/**
 * Promised-based wrapper for clutch-io's dispatcher function
 *
 * WARNING: If you are using this you may be missing out on many
 * of the advantages that the Task Monad has to offer.
 */

import {Clutch} from '../index';

export function promisifyTaskDispenser<T>(clutch: Clutch): (fn, record) => Promise<T> {
  return (fn: string | Function, record: any) => {
    return new Promise((resolve, reject) => {
      const t = clutch.getTask(fn, record);
      t.fork(reject, resolve);
    });
  }
}