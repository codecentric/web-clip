import { onOptionChange } from './onOptionChange';

describe('onOptionChange', () => {
  it('calls the callback when option identified by key changes', () => {
    const callback = jest.fn();
    const handler = onOptionChange('some-option', callback);
    handler(
      {
        'some-option': {
          newValue: 'new value',
          oldValue: 'old value',
        },
      },
      'sync'
    );
    expect(callback).toHaveBeenCalledWith('new value');
  });

  it('does not call callback when other option changed', () => {
    const callback = jest.fn();
    const handler = onOptionChange('some-option', callback);
    handler(
      {
        'other-option': {
          newValue: 'new value',
          oldValue: 'old value',
        },
      },
      'sync'
    );
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call callback, when namespace other than sync', () => {
    const callback = jest.fn();
    const handler = onOptionChange('some-option', callback);
    handler(
      {
        'some-option': {
          newValue: 'new value',
          oldValue: 'old value',
        },
      },
      'local'
    );
    expect(callback).not.toHaveBeenCalled();
  });
});
