export interface PageMetaData {
  type: 'WebPage';
  url: string;
  name: string;
}

export const usePage = (): PageMetaData => {
  return {
    type: 'WebPage',
    url: window.location.href,
    name: window.document.title,
  };
};
