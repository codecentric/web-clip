import nock from 'nock';
import { getClientAuthentication } from './getClientAuthentication';
import { launchWebAuthFlow } from './launchWebAuthFlow';
import {
  jwksResponse,
  openIdConfiguration,
  registerResponse,
  tokenResponse,
} from './mock-idp-responses';

jest.mock('./launchWebAuthFlow');

jest.mock('jose', () => ({
  generateKeyPair: () => ({
    privateKey: {
      alg: 'RSA',
    },
    publicKey: {},
  }),
  exportJWK: (publicKey: string) => Promise.resolve(publicKey),
  importJWK: () => Promise.resolve(),
  SignJWT: () => ({
    setProtectedHeader: () => ({
      setIssuedAt: () => ({
        sign: () => ({}),
      }),
    }),
  }),
  jwtVerify: () =>
    Promise.resolve({
      payload: {
        webid: 'https://pod.test/alice',
        sub: 'sub',
      },
    }),
}));

describe('getClientAuthentication', () => {
  it('can login', async () => {
    nock('https://pod.test')
      .persist()
      .get('/.well-known/openid-configuration')
      .reply(200, openIdConfiguration, { 'Access-Control-Allow-Origin': '*' });

    nock('https://pod.test')
      .post('/idp/reg')
      .reply(200, registerResponse, { 'Access-Control-Allow-Origin': '*' });

    nock('https://pod.test')
      .post('/idp/token')
      .reply(200, tokenResponse, { 'Access-Control-Allow-Origin': '*' });

    nock('https://pod.test')
      .get('/idp/jwks')
      .reply(200, jwksResponse, { 'Access-Control-Allow-Origin': '*' });

    nock('https://pod.test')
      .get('/alice')
      .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const redirectCallback = jest.fn();
    const clientAuthentication = getClientAuthentication(redirectCallback);

    await clientAuthentication.login(
      {
        sessionId: 'test-session',
        oidcIssuer: 'https://pod.test',
        redirectUrl: 'https://example.test/redirect-url',
        tokenType: 'DPoP',
      },
      null
    );

    expect(launchWebAuthFlow).toHaveBeenCalled();

    const returnToExtension = (launchWebAuthFlow as jest.Mock).mock.calls[0][1];
    await returnToExtension(
      'https://example.test/redirect-url?code=123&state=01111111011141119111011111111111'
    );

    expect(redirectCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        clientAppId: 'mock-client-id',
        clientAppSecret: 'mock-client-secret',
        expirationDate: null,
        isLoggedIn: true,
        issuer: 'https://pod.test/',
        redirectUrl:
          'https://example.test/redirect-url?state=01111111011141119111011111111111',
        refreshToken: undefined,
        sessionId: 'test-session',
        tokenType: 'DPoP',
        webId: 'https://pod.test/alice',
      })
    );
  });
});
