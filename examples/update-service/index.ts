import { Clutch } from '../../lib';

import { publish } from './commands/publish';
import { PublishDocument } from './documents/PublishDocument';

(async () => {
    const clutch = Clutch
        .create()
        .registerTask(publish, PublishDocument);

    const result = clutch.getTask(publish, {interestingInforation: 'hello'});
    console.log('dispatch result', result);
})();

