import { serialize, parse } from 'cookie';

export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: string;
}

export interface CookieResponse {
  setHeader: (header: string, object: any) => void;
  [key: string]: any;
}

export interface CookieRequest {
  cookies?: any;
  headers?: any;
  [key: string]: any;
}

const maxAge = 18000; // default 5 hours

const defaultCookieOptions: CookieOptions = {
  maxAge,
  expires: new Date(Date.now() + maxAge * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax',
};

export function setCookie(
  name: string,
  data: any,
  response: CookieResponse,
  options?: CookieOptions
): void {
  response.setHeader(
    'Set-Cookie',
    serialize(name, data, {
      ...defaultCookieOptions,
      ...options,
    })
  );
}

export function unsetCookie(name: string, response: CookieRequest): void {
  response.setHeader(
    'Set-Cookie',
    serialize(name, '', {
      maxAge: -1,
      path: '/',
    })
  );
}

export function getCookie(name: string, request: CookieRequest): any {
  return request.cookies
    ? request.cookies[name]
    : parse(request.headers?.cookie || '')[name];
}
