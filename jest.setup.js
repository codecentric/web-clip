import '@testing-library/jest-dom';
import 'whatwg-fetch';
import * as crypto from 'crypto';

// Polyfill for encoding which isn't present globally in jsdom
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.crypto = crypto;
