import { graph } from 'rdflib';
import { ChromeExtensionSession } from './authn/authn';
import { MessageType } from './messages';
import { importToStore } from './store/importToStore';
import Tab = chrome.tabs.Tab;

const session = new ChromeExtensionSession();

chrome.browserAction.onClicked.addListener(function (tab) {
  onClick(tab);
});

const store = graph();

async function testPrivateAccess() {
  const result = await session.fetch(
    'https://solidweb.me/webclip/webclip/test.txt',
    {
      method: 'PUT',
      body: 'test file',
    }
  );
  alert('Write file response code: ' + result.status);
}

session.login({
  redirectUrl: chrome.identity.getRedirectURL(),
  oidcIssuer: 'https://solidweb.me',
  clientName: 'WebClip background',
});

function onClick(tab: Tab) {
  console.log({ tab });
  importToStore(tab.url, store).then(() => {
    console.log(store.statements);
  });

  testPrivateAccess();

  chrome.tabs.sendMessage(tab.id, { type: MessageType.ACTIVATE }, function () {
    return null;
  });
}
