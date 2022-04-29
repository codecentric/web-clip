import { onOptionChange } from './onOptionChange';

export interface Options {
  /**
   * URL of the chosen OIDC provider
   */
  providerUrl: string;
  /**
   * whether WebClip is a trusted app with the required permissions in the connected pod
   */
  trustedApp: boolean;
}

const defaultsOptions: Options = {
  providerUrl: '',
  trustedApp: false,
};

export const save = (options: Options): Promise<Options> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(options, function () {
      console.log('saved options', options);
      resolve(options);
    });
  });
};

export const load = (): Promise<Options> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultsOptions, function (options) {
      console.log('loaded options', options);
      resolve(options as Options);
    });
  });
};

export const subscribeOption = (
  key: keyof Options,
  callback: (value: Options[typeof key]) => void
) => {
  load().then((options) => callback(options[key]));
  chrome.storage.onChanged.addListener(onOptionChange(key, callback));
};
