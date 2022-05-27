import { Session } from '@inrupt/solid-client-authn-browser';
import { render, screen } from '@testing-library/react';
import { when } from 'jest-when';
import React from 'react';
import { AuthorizationPage } from './AuthorizationPage';
import { useAuthorization } from './useAuthorization';

jest.mock('./useAuthorization');

describe('AuthorizationPage', () => {
  it('describes what is happening while loading', () => {
    const session = {} as Session;
    const providerUrl = 'https://pod.test';
    const extensionId = 'extension-id';
    when(useAuthorization)
      .calledWith(session, providerUrl, extensionId)
      .mockReturnValue({
        loading: true,
        success: false,
        error: null,
      });
    render(
      <AuthorizationPage
        session={session}
        providerUrl={providerUrl}
        extensionId={extensionId}
      />
    );
    expect(
      screen.getByText('Please wait, while WebClip is being authorized.')
    ).toBeInTheDocument();
  });

  it('shows success message after everything is finished', () => {
    const session = {} as Session;
    const providerUrl = 'https://pod.test';
    const extensionId = 'extension-id';
    when(useAuthorization)
      .calledWith(session, providerUrl, extensionId)
      .mockReturnValue({
        loading: false,
        success: true,
        error: null,
      });
    render(
      <AuthorizationPage
        session={session}
        providerUrl={providerUrl}
        extensionId={extensionId}
      />
    );
    expect(
      screen.getByText(
        'All done! You can now close this window and start using WebClip.'
      )
    ).toBeInTheDocument();
  });

  it('shows error message when anything failed', () => {
    const session = {} as Session;
    const providerUrl = 'https://pod.test';
    const extensionId = 'extension-id';
    when(useAuthorization)
      .calledWith(session, providerUrl, extensionId)
      .mockReturnValue({
        loading: false,
        success: false,
        error: new Error('test error'),
      });
    render(
      <AuthorizationPage
        session={session}
        providerUrl={providerUrl}
        extensionId={extensionId}
      />
    );
    expect(
      screen.getByText('Unfortunately something went wrong:')
    ).toBeInTheDocument();
    expect(screen.getByText('test error')).toBeInTheDocument();
  });
});
