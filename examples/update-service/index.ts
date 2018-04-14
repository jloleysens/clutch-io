import { Clutch } from '../../source/Clutch';
import { createDispatcher } from '../../source/dispatcher';

import { publish } from './commands/publish';
import { PublishDocument } from './documents/PublishDocument';

(async () => {
    const clutch = Clutch
        .create()
        .registerCommand(publish, PublishDocument);

    await clutch.initializeServices();
    const dispatch = createDispatcher(clutch);
    const result = await dispatch(publish, {deploymentId: 'asd', hash: '123', auth: '123', tag: '123', label: 'asd' });
    console.log('dispatch result', result);
})();

