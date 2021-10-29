module.exports = function () {
  return {
    autoDetect: true,
    files: [
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.spec.ts',
      '!src/**/*.spec.tsx',
    ],
    tests: [
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
      '!src/**/*.integration.spec.ts',
      '!src/**/*.integration.spec.tsx',
    ],
  };
};
