import React from 'react';
import { Toolbar } from './Toolbar';
import { usePage } from './usePage';
import { usePageData } from './usePageData';
import { useLegacyProfile } from './useLegacyProfile';

export const ToolbarContainer = () => {
  const { loading: profileLoading, profile } = useLegacyProfile();
  const { url } = usePage();
  const { loading: dataLoading } = usePageData(url);
  return profileLoading || dataLoading ? (
    <p className="my-1">Loading...</p>
  ) : (
    <Toolbar profile={profile} />
  );
};
