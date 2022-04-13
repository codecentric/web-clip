import { onOptionChange } from './onOptionChange';

export interface Options {
  providerUrl: string;
}

const defaultsOptions: Options = {
  providerUrl: '',
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
  callback: (value: string) => void
) => {
  load().then((options) => callback(options[key]));
  chrome.storage.onChanged.addListener(onOptionChange(key, callback));
};
