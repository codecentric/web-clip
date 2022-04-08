import React, { FunctionComponent } from 'react';

interface Props {
  loading: boolean;
  loadingLabel: string;
  onClick: () => void;
}

export const Button: FunctionComponent<Props> = ({
  children,
  onClick,
  loading,
  loadingLabel,
}) => {
  const loadingClass =
    'animate-pulse my-1 px-4 py-2 bg-green-400 rounded text-white font-bold';
  const defaultClass =
    'my-1 px-4 py-2 bg-blue-400 rounded text-white hover:opacity-90 font-bold';
  return (
    <button
      className={loading ? loadingClass : defaultClass}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? loadingLabel : children}
    </button>
  );
};
