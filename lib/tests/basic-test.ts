import {describe} from 'riteway';
import {Clutch, Task} from '../index';
import * as t from 'tape';

describe('basic/Clutch()', async should => {
  const clutch = Clutch.create();
  const { assert } = should();

  function* test() {}

  assert({
    given: 'a new instance',
    should: 'have no commands',
    actual: clutch.listAvailableTasks(),
    expected: [],
  });

  clutch.registerTask(test, json => {});

  assert({
    given: 'a new command',
    should: 'report on the new command',
    actual: clutch.listAvailableTasks(),
    expected: ['test'],
  });
});

t('tasks/Clutch', async ct => {
  const c = Clutch.create();
  function* test () {}
  c.registerTask(test, json => {});

  const result = c.getTask(test, {});
  ct.assert(result instanceof Task, 'should get a task back');
  ct.end();
});