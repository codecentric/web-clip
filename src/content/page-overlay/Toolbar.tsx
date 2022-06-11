import React from 'react';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useBookmark } from './useBookmark';
import { usePage } from './usePage';

interface Props {
  profile: {
    name: string;
  };
}

export const Toolbar = ({ profile }: Props) => {
  const page = usePage();
  const { addBookmark, loading, saving, error, bookmark } = useBookmark(page);
  return (
    <>
      <p className="my-1">{profile.name}</p>
      {loading ? null : (
        <Button
          loading={saving}
          loadingLabel="Saving..."
          onClick={() => addBookmark()}
        >
          Clip it!
        </Button>
      )}
      {error && <ErrorMessage error={error} />}
      {bookmark && (
        <p className="my-1 text-blue-400 opacity-90 hover:opacity-100">
          <a href={bookmark.uri} target="_blank" rel="noreferrer">
            Show in pod
          </a>
        </p>
      )}
    </>
  );
};
