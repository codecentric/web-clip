import { Fetcher, graph, lit, LiveStore, st, sym, UpdateManager } from 'rdflib';
import urljoin from 'url-join';
import { Storage } from '../domain/Storage';
import { StorageStore } from '../store/StorageStore';

export class StorageApi {
  private store: StorageStore;
  private fetcher: Fetcher;
  private updater: UpdateManager;

  constructor(private webId: string, liveStore: LiveStore) {
    this.store = new StorageStore(liveStore);
    this.fetcher = liveStore.fetcher;
    this.updater = liveStore.updater;
  }

  async findStorage(): Promise<Storage | null> {
    await this.fetcher.load(this.webId);
    return this.store.getStorageForWebId(this.webId);
  }

  /**
   * validates if the given container URL points to an actual container that
   * is editable by the current user
   * @param containerUrl
   */
  async validateIfContainer(containerUrl: string): Promise<boolean> {
    try {
      await this.fetcher.load(containerUrl);
    } catch (err) {
      try {
        await this.updater.update(
          [],
          this.store.createContainerStatement(containerUrl)
        );
        return true;
      } catch (err) {
        return false;
      }
    }
    return (
      this.store.isContainer(containerUrl) &&
      !!this.updater.editable(containerUrl)
    );
  }
}
