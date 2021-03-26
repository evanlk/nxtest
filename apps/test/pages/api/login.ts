import connect from 'next-connect';

import { createSessionMiddleware } from '@nxtest/shared/util-session';

const authenticate = async () => {
  return { user: { id: 1, name: 'John Smith' } };
};

export default connect()
  .use(createSessionMiddleware(authenticate))
  .get((req, res) => {
    res.json({ status: 'success' });
    s;
  });
