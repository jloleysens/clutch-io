import { Observable, Subject, Scheduler } from 'rxjs';
import { validate } from 'class-validator';

import { exec } from './exec';
import { Store } from './store';
import { CommandParams, Command, Doc } from './common';
import { InternalCommandParams } from './internal';


export function createDispatcher(store: Store) {
  const in$ = new Subject<InternalCommandParams>();

  /* Set up the message$ operators */
  const message$ = in$
  // Get the goods
  .map(m => {
    m._mappedCommand = store.getCommand(m.command);
    m._mappedDocument = m._mappedCommand.docFac(m.params.document);
    return m;
  })
  // Validation
  .flatMap(m => {
    return Observable.fromPromise(validate(m._mappedDocument).then(() => m))
    .catch(e => {
      console.error(e);
      m.errors = m.errors ? m.errors.concat(e) : [e];
      return Observable.of(m);
    });
  })
  // TODO: Handle errors properly
  .map(m => {
    const result = exec(m._mappedCommand.fn, m._mappedDocument, store.getServiceBroker());
    m.resolve(result);
    return m;
  })
  .observeOn(Scheduler.async);

  return {

    dispatch(cmd: CommandParams) {
      return new Promise((resolve, reject) => {
        in$.next(Object.assign(cmd, {resolve}));
      });
    },
    message$,
    in$,
  };
}