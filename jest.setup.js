import '@testing-library/jest-dom';
import fetch from 'node-fetch';

// Polyfill for encoding which isn't present globally in jsdom
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.crypto = {
  // use a fixed random value to be able to determine the state parameter for the auth flow,
  // which will be 01111111011141119111011111111111 for Uint8Array.of(1, 2, 3, 4)
  getRandomValues: () => Uint8Array.of(1, 2, 3, 4),
};

window.fetch = fetch;
