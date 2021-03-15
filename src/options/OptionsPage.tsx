import React from 'react';
import { useOptions } from './useOptions';

export const OptionsPage = () => {
  const { loading, providerUrl, setProviderUrl, save } = useOptions();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <label>
        <p>Pod Provider URL</p>
        <input
          onChange={(e) => setProviderUrl(e.target.value)}
          value={providerUrl}
          type="url"
          required
        />
      </label>
      <button
        onClick={() =>
          save({
            providerUrl,
          })
        }
      >
        Save
      </button>
    </section>
  );
};
