export interface Options {
  providerUrl: string;
}

const defaultsOptions: Options = {
  providerUrl: 'https://solidcommunity.net',
};

export const useOptionsStorage = () => {
  return {
    save: (options: Options): Promise<Options> => {
      return new Promise((resolve) => {
        chrome.storage.sync.set(options, function () {
          console.log('saved options', options);
          resolve(options);
        });
      });
    },
    load: (): Promise<Options> => {
      return new Promise((resolve) => {
        chrome.storage.sync.get(defaultsOptions, function (options) {
          console.log('loaded options', options);
          resolve(options as Options);
        });
      });
    },
  };
};
