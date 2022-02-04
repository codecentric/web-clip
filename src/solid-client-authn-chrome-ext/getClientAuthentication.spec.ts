import { getClientAuthentication } from './getClientAuthentication';
import { openIdConfiguration, registerResponse } from './mock-idp-responses';
import { launchWebAuthFlow } from './launchWebAuthFlow';
import nock from 'nock';

jest.mock('./launchWebAuthFlow');

describe('getClientAuthentication', () => {
  it('can login', async () => {
    nock('https://pod.test')
      .persist()
      .get('/.well-known/openid-configuration')
      .reply(200, openIdConfiguration, { 'Access-Control-Allow-Origin': '*' });

    nock('https://pod.test')
      .post('/idp/reg')
      .reply(200, registerResponse, { 'Access-Control-Allow-Origin': '*' });

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
    // expect(redirectCallback).toHaveBeenCalled();
  });
});
