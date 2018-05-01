import { Clutch } from '../../lib';
import { createDispatcher } from '../../lib';

import { publish } from './commands/publish';
import { PublishDocument } from './documents/PublishDocument';

(async () => {
    const clutch = Clutch
        .create()
        .registerCommand(publish, PublishDocument);

    const dispatch = createDispatcher(clutch);
    const result = await dispatch(publish, {deploymentId: 'asd', hash: '123', auth: '123', tag: '123', label: 'asd' });
    console.log('dispatch result', result);
})();

