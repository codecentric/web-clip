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

export function containerResponse(
  userPermissions = 'read write append control',
  publicPermissions = ''
) {
  return {
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
      'wac-allow': `user="${userPermissions}", public="${publicPermissions}"`,
      'ms-author-via': 'SPARQL',
      Link: '<http://www.w3.org/ns/ldp#Container>; rel="type"',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => `
    @prefix ldp: <http://www.w3.org/ns/ldp#>.
    <> a ldp:Container, ldp:BasicContainer, ldp:Resource .
    `,
  };
}

export function storageResponse(
  userPermissions = 'read write append control',
  publicPermissions = ''
) {
  return {
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
      'wac-allow': `user="${userPermissions}", public="${publicPermissions}"`,
      'ms-author-via': 'SPARQL',
      Link: 'Link: <http://www.w3.org/ns/pim/space#Storage>; rel="type"',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => `
    @prefix ldp: <http://www.w3.org/ns/ldp#>.
    <> a <http://www.w3.org/ns/pim/space#Storage>, ldp:Container, ldp:BasicContainer, ldp:Resource .
    `,
  };
}
