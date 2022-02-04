import { getClientAuthentication } from './getClientAuthentication';
import { openIdConfiguration, registerResponse } from './mock-idp-responses';
import { launchWebAuthFlow } from './launchWebAuthFlow';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

jest.mock('./launchWebAuthFlow');

const server = setupServer(
  rest.get(
    'https://pod.test/.well-known/openid-configuration',
    (req, res, ctx) => {
      // Respond with a mocked user token that gets persisted
      // in the `sessionStorage` by the `Login` component.
      return res(ctx.json(openIdConfiguration));
    }
  ),
  rest.post('https://pod.test/idp/reg', (req, res, ctx) => {
    // Respond with a mocked user token that gets persisted
    // in the `sessionStorage` by the `Login` component.
    return res(ctx.json(registerResponse));
  })
);
describe('getClientAuthentication', () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: (request) => {
        console.error('unhandled request', request.url.toString(), request);
      },
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('can login', async () => {
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
    //expect(redirectCallback).toHaveBeenCalled();
  });
});
