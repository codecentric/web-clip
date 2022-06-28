import React from 'react';
import { Profile } from '../../domain/Profile';

export const ProfileInfo = ({ webId, name }: Profile) => {
  return (
    <div className="has-tooltip m-2">
      <div className="tooltip mt-5 ml-5 h-0 w-0 border-x-8 border-b-[6px] border-x-transparent border-b-stone-400"></div>
      <span className="break-all tooltip text-sm mt-6 -ml-12 rounded bg-stone-400 p-1 text-white shadow-lg">
        {webId}
      </span>
      {name}
    </div>
  );
};
