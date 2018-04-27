import * as t from 'tape';
import {compose, pipe} from './utils';

t('utils#pipe', ct => {
  const val = 1;
  const minus1pow4 = pipe(x => x - 1, Math.sqrt);
  ct.equals(minus1pow4(val), 0, 'Pipes in a predictable order');
  ct.end();
});


t('utils#compose', ct => {
  const val = 4;
  const minus1pow4 = compose(x => x - 1, Math.sqrt);
  ct.equals(minus1pow4(val), 1, 'Composes in a predictable order');
  ct.end();
});