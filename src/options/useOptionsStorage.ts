interface Options {
  providerUrl: string;
}

export const useOptionsStorage = () => {
  return {
    save: (options: Options) => {
      console.log(options);
    },
  };
};
