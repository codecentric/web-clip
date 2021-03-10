export const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ACTIVATE: 'ACTIVATE'
};

export function login () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: types.LOGIN }, function (response) {
      console.log({ response });
    });
  });
}

export function logout () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: types.LOGOUT }, function (response) {
      console.log({ response });
    });
  });
}
