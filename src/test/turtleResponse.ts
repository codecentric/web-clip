export function turtleResponse(
  bodyText: string,
  userPermissions = 'read write append control',
  publicPermissions = ''
) {
  return {
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
      'wac-allow': `user="${userPermissions}", public="${publicPermissions}"`,
      'ms-author-via': 'SPARQL',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => bodyText,
  };
}
