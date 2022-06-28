import React from 'react';
import { Profile } from '../../domain/Profile';

export const ProfileInfo = ({ webId, name }: Profile) => {
  return (
    <div className="has-tooltip m-2 border rounded-full text-sm">
      <div className="tooltip mt-5 ml-5 h-0 w-0 border-x-8 border-b-[6px] border-x-transparent border-b-stone-400"></div>
      <span className="tooltip mt-6 -ml-12 break-all rounded bg-stone-400 p-1 text-sm text-white shadowLg">
        {webId}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className=" rounded-full bg-gray-200 inline h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <span className="m-1 mr-3">{name}</span>
    </div>
  );
};
