import { PageMetaData } from '../../domain/PageMetaData';

export const usePage = (): PageMetaData => {
  return {
    type: 'WebPage',
    url: window.location.href,
    name: window.document.title,
  };
};
