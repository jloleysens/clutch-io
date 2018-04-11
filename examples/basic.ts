import { createDispatcher } from '../source/dispatcher';
import { createStore } from '../source/store';

const store = createStore();
const dispatcher = createDispatcher(store);

console.log(store);
console.log(dispatcher);
