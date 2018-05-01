import * as t from 'tape';
import {Task} from '../index';

const unexpectedE = ct => e => ct.fail(`Task#of errored unexpectedly with ${e.message}`);
t('Task#of', ct => {
  const noop = () => {};
  Task.of(null).fork(
    unexpectedE(ct),
    s => {
      ct.equals(s, null, 'Task#of resolves to expected value');
      ct.end();
    }
  );
});

t('Task#map', ct => {
  Task.of(1).map(x => x + 1).fork(
    unexpectedE(ct),
    s => {
      ct.equals(s, 2, 'Task#map maps over future, resolved value');
      ct.end();
    }
  );
});

t('Task#flatMap', ct => {
  const t2 = val => new Task((rej, res) => res(val + 1));
  Task.of(1).flatMap(t2).fork(
    unexpectedE(ct),
    s => {
      ct.equals(s, 2, 'Task#map maps over future using a function map a monad from one to another');
      ct.end();
    }
  );
});

t('Task#toJSON', ct => {
  const testFn = async () => {};
  const t2 = Task.callP(testFn, 1).map(x => x);
  ct.deepEquals(t2.toJSON(), {fn: testFn, args: [1]}, 'Task#toJSON returns arguments in the correct format.');
  ct.end();
});