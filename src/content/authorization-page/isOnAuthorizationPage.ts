export const isOnAuthorizationPage = (extensionId: string): boolean => {
  return window.location.pathname.endsWith(`/.web-clip/${extensionId}`);
};
