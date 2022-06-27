import { when } from 'jest-when';
import { OptionsStorage } from './OptionsStorage';
import { load, onChanged } from './optionsStorageApi';

jest.mock('./optionsStorageApi');

describe('OptionsStorage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('holds the loaded options initially', async () => {
    when(load).mockResolvedValue({
      providerUrl: 'https://provider.test',
      containerUrl: 'https://container.test',
      trustedApp: true,
    });
    const storage = new OptionsStorage();
    await storage.init();
    expect(storage.getOptions()).toEqual({
      providerUrl: 'https://provider.test',
      containerUrl: 'https://container.test',
      trustedApp: true,
    });
  });

  it('holds changed and unchanged values after a change', async () => {
    when(load).mockResolvedValue({
      providerUrl: 'https://provider.test',
      containerUrl: 'https://container.test',
      trustedApp: true,
    });
    const storage = new OptionsStorage();
    await storage.init();
    expect(onChanged).toHaveBeenCalled();
    const change = (onChanged as jest.Mock).mock.calls[0][0];
    change(
      {
        providerUrl: {
          newValue: 'https://new.provider.test',
          oldValue: 'https://provider.test',
        },
        containerUrl: {
          newValue: 'https://new.container.test',
          oldValue: 'https://container.test',
        },
      },
      'sync'
    );
    expect(storage.getOptions()).toEqual({
      providerUrl: 'https://new.provider.test',
      containerUrl: 'https://new.container.test',
      trustedApp: true,
    });
  });

  it('ignore changes in other namspaces than sync', async () => {
    when(load).mockResolvedValue({
      providerUrl: 'https://provider.test',
      containerUrl: 'https://container.test',
      trustedApp: true,
    });
    const storage = new OptionsStorage();
    await storage.init();
    expect(onChanged).toHaveBeenCalled();
    const change = (onChanged as jest.Mock).mock.calls[0][0];
    change(
      {
        providerUrl: {
          newValue: 'https://new.provider.test',
          oldValue: 'https://provider.test',
        },
        containerUrl: {
          newValue: 'https://new.container.test',
          oldValue: 'https://container.test',
        },
      },
      'managed'
    );
    expect(storage.getOptions()).toEqual({
      providerUrl: 'https://provider.test',
      containerUrl: 'https://container.test',
      trustedApp: true,
    });
  });

  describe('events', () => {
    it('notifies about all changes', async () => {
      when(load).mockResolvedValue({
        providerUrl: 'https://provider.test',
        containerUrl: 'https://container.test',
        trustedApp: true,
      });
      const storage = new OptionsStorage();
      await storage.init();
      expect(onChanged).toHaveBeenCalled();
      const providerUrlListener = jest.fn();
      const containerUrlListener = jest.fn();
      const trustedAppListener = jest.fn();
      storage.on('providerUrl', providerUrlListener);
      storage.on('containerUrl', containerUrlListener);
      storage.on('trustedApp', trustedAppListener);
      const change = (onChanged as jest.Mock).mock.calls[0][0];
      change(
        {
          providerUrl: {
            newValue: 'https://new.provider.test',
            oldValue: 'https://provider.test',
          },
          containerUrl: {
            newValue: 'https://new.container.test',
            oldValue: 'https://container.test',
          },
        },
        'sync'
      );
      expect(providerUrlListener).toHaveBeenCalledWith({
        newValue: 'https://new.provider.test',
        oldValue: 'https://provider.test',
      });
      expect(containerUrlListener).toHaveBeenCalledWith({
        newValue: 'https://new.container.test',
        oldValue: 'https://container.test',
      });
      expect(trustedAppListener).not.toHaveBeenCalled();
    });
  });
});
