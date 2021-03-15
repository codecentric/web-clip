interface StorageChange {
  oldValue: string;
  newValue: string;
}

type AreaName = 'sync' | 'local' | 'managed';

export const onOptionChange = (
  key: string,
  callback: (value: string) => void
) => (changes: { [p: string]: StorageChange }, namespace: AreaName) => {
  const change = changes[key];
  if (change && namespace === 'sync') {
    callback(change.newValue);
  }
};
