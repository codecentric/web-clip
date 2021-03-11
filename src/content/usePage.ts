export interface PageMetaData {
  type: string;
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
