import {describe} from 'riteway';
import {Clutch} from '../Clutch';
import * as t from 'io-ts';

describe('basic/Clutch()', async should => {
  const clutch = new Clutch();
  const { assert } = should();

  function* test() {}
  const i = t.interface({test: t.string});

  assert({
    given: 'a new instance',
    should: 'have no commands',
    actual: clutch.listCommands(),
    expected: [],
  });

  clutch.registerCommand(test, i);

  assert({
    given: 'a new command',
    should: 'report on the new command',
    actual: clutch.listCommands(),
    expected: ['test'],
  });

  assert({
    given: 'a fn refernce',
    should: 'return the correct internal reference',
    actual: clutch.getCommand(test).fn,
    expected: test,
  });


  assert({
    given: 'a string name of a fn',
    should: 'return the correct internal reference',
    actual: clutch.getCommand('test').fn,
    expected: test,
  });

});