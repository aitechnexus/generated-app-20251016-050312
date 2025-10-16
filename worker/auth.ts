import { Hono, Next } from 'hono';
import { Context } from 'hono';
import { verify } from 'hono/jwt';
import type { Env } from './core-utils';
// Manually define types as they are not always exported from hono/jwt
export type JoseHeader = {
  alg: string;
  kid?: string;
  [key: string]: unknown;
};
export type JWTPayload = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  email?: string;
  [key:string]: unknown;
};
type JWK = {
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
};
type JWKS = {
  keys: JWK[];
};
export interface UserIdentity {
  email: string;
}
const fetcher = (url: string) => fetch(url).then((r) => r.json());
export const authMiddleware = async (c: Context<{ Bindings: Env; Variables: { user: UserIdentity } }>, next: Next) => {
  const getKey = async (header: JoseHeader, payload: JWTPayload): Promise<CryptoKey> => {
    const certsUrl = `https://${c.env.CF_ACCESS_TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`;
    const jwks = await fetcher(certsUrl);
    const jwk = (jwks as JWKS).keys.find((key) => key.kid === header.kid);
    if (!jwk) {
      throw new Error('JWK not found');
    }
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
  };
  const token = c.req.header('cf-access-jwt-assertion');
  if (!token) {
    return c.json({ success: false, error: 'Unauthorized: No token provided' }, 401);
  }
  try {
    const payload = await verify(token, getKey, {
      alg: 'RS256',
      audience: c.env.CF_ACCESS_AUD,
    });
    if (!payload || !payload.email) {
      return c.json({ success: false, error: 'Unauthorized: Invalid token payload' }, 401);
    }
    c.set('user', { email: payload.email as string });
    await next();
  } catch (e) {
    console.error('JWT Verification failed:', e);
    return c.json({ success: false, error: `Unauthorized: ${e instanceof Error ? e.message : 'Invalid token'}` }, 401);
  }
};