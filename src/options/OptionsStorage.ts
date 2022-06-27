import { load, onChanged, Options } from './optionsStorageApi';

export class OptionsStorage {
  private value: Options;

  async init() {
    this.value = await load();
    this.updateWhenChanged();
  }

  private updateWhenChanged() {
    onChanged((changes, namespace) => {
      if (namespace !== 'sync') return;
      const result = Object.keys(changes).reduce(
        (acc, value) => ({
          ...acc,
          [value]: changes[value].newValue,
        }),
        {}
      );
      this.value = {
        ...this.value,
        ...result,
      };
    });
  }

  getOptions(): Options {
    return this.value;
  }
}
