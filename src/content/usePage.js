export const usePage = (tab) => {
  return {
    type: 'WebPage',
    url: window.location.href,
    name: window.document.title
  };
}