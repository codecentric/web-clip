import React from 'react';
import { Toolbar } from './Toolbar';
import { usePage } from './usePage';
import { useLegacyPageData } from './useLegacyPageData';
import { useLegacyProfile } from './useLegacyProfile';

export const ToolbarContainer = () => {
  const { loading: profileLoading, profile } = useLegacyProfile();
  const { url } = usePage();
  const { loading: dataLoading } = useLegacyPageData(url);
  return profileLoading || dataLoading ? (
    <p className="my-1">Loading...</p>
  ) : (
    <Toolbar profile={profile} />
  );
};
