export function getContainerUrl(uri: string) {
  const containerUri = moveUp(uri);
  if (containerUri !== uri) {
    return containerUri;
  } else {
    return null;
  }
}

function moveUp(uri: string) {
  if (uri.endsWith('/')) {
    return new URL('..', uri).toString();
  } else {
    return new URL('.', uri).toString();
  }
}
