import { createDispatcher } from '../lib';
import { Clutch } from '../lib';

const c = Clutch.create();
const dispatcher = createDispatcher(c);

console.log(c);
console.log(dispatcher);
