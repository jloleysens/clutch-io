import { lift } from '../../../lib/Clutch';

const someAsyncOperation = () => new Promise(res => setTimeout(() => {
  console.log('We are going async!');
  res(true);
}, 500));

export function* publish(document: any, services: any, logger: any) {
  const result = yield lift(someAsyncOperation, document);
  return { success: result };
}
