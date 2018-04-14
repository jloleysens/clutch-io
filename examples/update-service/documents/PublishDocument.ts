import * as t from 'io-ts';

export const PublishDocument = t.type({
  deploymentId: t.string,
  hash: t.string,
  auth: t.string,
  tag: t.string,
  label: t.string,
});