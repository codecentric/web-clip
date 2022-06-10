import { graph, parse } from 'rdflib';
import { ProfileStore } from './ProfileStore';

describe('ProfileStore', () => {
  describe('holdsOrigin', () => {
    it('returns false if store is empty', () => {
      const store = graph();
      const profileStore = new ProfileStore(store);
      const result = profileStore.holdsOrigin(
        'https://pod.test/alice#me',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(false);
    });

    it('returns false if store contains trusted app, but not for the given origin', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <https://wrong-id.chromiumapp.org> ;
          acl:mode acl:Read, acl:Write, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.holdsOrigin(
        'https://pod.test/alice#me',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(false);
    });

    it('returns true if store contains trusted app with the given origin', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <https://extension-id.chromiumapp.org> ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.holdsOrigin(
        'https://pod.test/alice#me',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(true);
    });

    it('even returns true, if anything points to the origin', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <> acl:origin <https://extension-id.chromiumapp.org> .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.holdsOrigin(
        'https://pod.test/alice#me',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(true);
    });

    it('returns false if trusted app statements are found outside of the WebID profile doc', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <https://pod.test/alice#me> acl:trustedApp [
          acl:origin <https://extension-id.chromiumapp.org> ;
        ] .
        `,
        store,
        'https://pod.test/bob'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.holdsOrigin(
        'https://pod.test/alice#me',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(false);
    });
  });

  describe('checkAccessPermissions', () => {
    it('returns false if store is empty', () => {
      const store = graph();
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });
    it('returns false if store contains trusted app, but not for extension origin', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <chrome-extension://wrong-id> ;
          acl:mode acl:Read, acl:Write, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });

    it('returns false if trusted app is not assigned to WebID', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#other> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Read, acl:Write, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });

    it('returns false if trusted app is missing Read permission', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Write, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });

    it('returns false if trusted app is missing Write permission', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Read, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });

    it('returns false if trusted app is missing Append permission', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Read, acl:Write ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });

    it('returns true if store contains trusted app for extension origin and read and write permissions', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <#me> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Read, acl:Write, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/alice'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(true);
    });

    it('returns false if trusted app statements are found outside of the WebID profile doc', () => {
      const store = graph();
      parse(
        `
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <https://pod.test/alice#me> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Read, acl:Write, acl:Append ;
        ] .
        `,
        store,
        'https://pod.test/bob'
      );
      const profileStore = new ProfileStore(store);
      const result = profileStore.checkAccessPermissions(
        'https://pod.test/alice#me',
        'chrome-extension://extension-id'
      );
      expect(result).toBe(false);
    });
  });
});
