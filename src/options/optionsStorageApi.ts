export interface Options {
  /**
   * URL of the chosen OIDC provider
   */
  providerUrl: string;
  /**
   * whether WebClip is a trusted app with the required permissions in the connected pod
   */
  trustedApp: boolean;
  /**
   * url of a container where the data is stored
   */
  containerUrl: string;
}

type AreaName = 'sync' | 'local' | 'managed';

interface StorageChange {
  oldValue: string;
  newValue: string;
}

const defaultsOptions: Options = {
  providerUrl: '',
  trustedApp: false,
  containerUrl: '',
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

export const onChanged = (
  listener: (
    changes: { [p: string]: StorageChange },
    namespace: AreaName
  ) => void
) => chrome.storage.onChanged.addListener(listener);
