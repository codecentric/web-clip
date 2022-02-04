import '@testing-library/jest-dom';
import * as crypto from 'crypto';
import fetch from 'node-fetch';

// Polyfill for encoding which isn't present globally in jsdom
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.crypto = crypto;
window.fetch = fetch;
