import { Task } from '../../../lib';

const someAsyncOperation = () => new Promise(res => setTimeout(() => {
  console.log('We are going async!');
  res(true);
}, 500));

export function* publish(document: any, services: any, logger: any) {
  // Create a new task using Tasks's callP helper
  const result = yield Task.callP(someAsyncOperation, document);
  return { success: result };
}
