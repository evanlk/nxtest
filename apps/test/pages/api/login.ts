import connect from 'next-connect';

import { createSessionMiddleware } from '@nxtest/shared/util-session';

export default connect()
  .use(createSessionMiddleware())
  .get((req: any, res: any) => {
    res.json({ status: 'success' });
  });
