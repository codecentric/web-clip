import React from 'react';

export const HelpSection = () => {
  return (
    <section className="bg-blue-50 p-2 rounded-lg border-2 border-blue-300">
      <h2 className="text-lg font-medium my-4">Need help?</h2>
      <p className="my-4">
        Do not hesitate to contact us, if you struggle with the setup process.{' '}
        <a
          className="block font-bold my-1 text-blue-600 hover:underline"
          href="https://github.com/codecentric/web-clip/discussions/categories/q-a"
        >
          Just post to our Q&A section on GitHub.
        </a>
      </p>
      <p className="my-4">
        Meanwhile we are working on simplifying the onboarding process!
      </p>
    </section>
  );
};
