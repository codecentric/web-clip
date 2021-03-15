export const useOptions = () => {
  return {
    providerUrl: 'https://solidcommunity.net',
    save: (): void => {
      console.log('saved!');
    },
  };
};
