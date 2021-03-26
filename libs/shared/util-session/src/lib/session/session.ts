export function createSessionMiddleware() {
  return async (req, res, next) => {
    req.user = { id: 1, name: 'John Smith', roles: ['user'] };
    next();
  };
}
