export const isOnAuthorizationPage = (extensionId: string): boolean => {
  return window.location.pathname === `/.web-clip/${extensionId}`;
};
