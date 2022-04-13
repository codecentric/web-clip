export const prettifyUrl = (url: string): string => {
  try {
    const domain = new URL(url);
    return domain.host;
  } catch (err) {
    console.log('error parsing pod provider url', err);
    return '';
  }
};
