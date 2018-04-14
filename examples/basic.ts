import { createDispatcher } from '../source/dispatcher';
import { Clutch } from '../source/Clutch';

const c = Clutch.create();
const dispatcher = createDispatcher(c);

console.log(c);
console.log(dispatcher);
