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
   * tries to ensure, that the given container URL points to a valid container.
   * Therefore, the container must exist and be editable by the current user.
   * If the container does not exist, it tries to create a container at that location.
   * Returns true if finally a valid container exists at the URL, or false otherwise.
   * @param containerUrl
   */
  async ensureValidContainer(containerUrl: string): Promise<boolean> {
    try {
      await this.fetcher.load(containerUrl);
    } catch (err) {
      if (err.status === 404) {
        return await this.tryToCreateContainerAt(containerUrl);
      }
      console.log(err);
      return false;
    }
    return (
      this.store.isContainer(containerUrl) &&
      !!this.updater.editable(containerUrl)
    );
  }

  private async tryToCreateContainerAt(containerUrl: string) {
    try {
      await this.updater.update(
        [],
        this.store.createContainerStatement(containerUrl)
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
