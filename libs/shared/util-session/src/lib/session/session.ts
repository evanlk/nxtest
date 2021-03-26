import * as iron from '@hapi/iron';

import {
  setCookie,
  CookieResponse,
  unsetCookie,
  getCookie,
  CookieRequest,
} from '@nxtest/shared/util-session';

const sessionName = 'sessionToken';
const sessionSecret = 'badsecret123';

export async function setSession(
  response: CookieResponse,
  data: any,
  maxAge: number = 18000 // 5 hours
) {
  const token = await iron.seal(
    { ...data, maxAge, createdAt: Date.now() },
    sessionSecret,
    iron.defaults
  );

  setCookie(sessionName, token, response, { maxAge });
}

export async function getSession(request: CookieRequest) {
  const token = getCookie(sessionName, request);

  if (!token) return null;

  const session = await iron.unseal(token, sessionSecret, iron.defaults);

  if (Date.now() > session.createdAt + session.maxAge * 1000) {
    return { error: 'Session has expired' };
  }

  return session;
}

export function destroySession(response: CookieResponse) {
  unsetCookie(sessionName, response);
}

const error500Json = {
  error: 'An error has occurred while processing your reques ',
};

export type SessionAuthenticate = (
  request: any
) => Promise<{ error: string | null; user: any }>;

export function createSessionMiddleware(authenticate: SessionAuthenticate) {
  return async (request: CookieRequest, response: any, next) => {
    try {
      const { error, user } = await authenticate(request);

      if (Boolean(!error) && Boolean(user)) {
        request.user = user;
        await setSession(response, user);
      } else {
        request.user = { error };
      }

      return next();
    } catch (error) {
      console.error(error);
      response.status(500).json(error500Json);
    }

    next();
  };
}

export function sessionMiddleware() {
  return async (request: CookieRequest, response: CookieResponse, next) => {
    try {
      const session = await getSession(request);

      if (Boolean(session)) {
        request.user = session;
      } else {
        request.user = { error: 'unauthenticated user' };
      }

      return next();
    } catch (error) {
      console.error(error);
      response.status(500).json(error500Json);
    }
  };
}
