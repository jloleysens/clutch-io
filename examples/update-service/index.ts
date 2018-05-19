import { Clutch } from '../../lib';

import { publish } from './commands/publish';
import { PublishDocument } from './documents/PublishDocument';

(async () => {
    const clutch = Clutch
        .create()
        .registerTask(publish, PublishDocument);

    const result = clutch.getTask(publish, {deploymentId: 'asd', hash: '123', auth: '123', tag: '123', label: 'asd' });
    console.log('dispatch result', result);
})();

