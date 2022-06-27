import { EventEmitter } from 'events';
import { load, onChanged, Options } from './optionsStorageApi';

/**
 * Provides access to the current values of the extension options.
 * Emits an event with the same name as the option, when an option changes.
 */
export class OptionsStorage extends EventEmitter {
  private value: Options;

  constructor() {
    super();
  }

  /**
   * Initially loads the option values from storage
   */
  async init() {
    this.value = await load();
    this.updateWhenChanged();
  }

  private updateWhenChanged() {
    onChanged((changes, namespace) => {
      if (namespace !== 'sync') return;
      const keys = Object.keys(changes);
      const result = keys.reduce(
        (acc, value) => ({
          ...acc,
          [value]: changes[value].newValue,
        }),
        {}
      );
      keys.forEach((key) => this.emit(key, changes[key]));
      this.value = {
        ...this.value,
        ...result,
      };
    });
  }

  /**
   * The current option values
   */
  getOptions(): Options {
    return this.value;
  }
}
