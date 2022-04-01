import React from 'react';

interface Props {
  extensionUrl: string;
}

export const AuthorizationSection = ({ extensionUrl }: Props) => {
  return (
    <section>
      <h2 className="text-lg font-medium my-8">3) Authorize Access</h2>
      <p className="my-4">
        Please add the following extension URL as a trusted app to your Pod,
        granting at least <code>Read</code>, <code>Write</code> and{' '}
        <code>Append</code> access{' '}
        <a
          className="text-blue-600 hover:underline"
          href="https://github.com/solid/userguide#manage-your-trusted-applications"
        >
          {' '}
          as described in the user guide
        </a>
        .
        <pre className="my-4 bg-gray-50 border-2 border-gray-700 p-3">
          {extensionUrl}
        </pre>
      </p>
    </section>
  );
};
