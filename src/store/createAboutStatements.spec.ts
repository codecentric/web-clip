import { lit, st, sym } from 'rdflib';
import { createAboutStatements } from './createAboutStatements';

describe('create about statements', () => {
  it('no about statements are created if there are no statements at all', () => {
    const abouts = createAboutStatements(
      sym('https://page.example/'),
      [],
      sym('https://pod.example/webclip/1')
    );
    expect(abouts).toEqual([]);
  });

  it('an about statement is created if there is any statement', () => {
    const abouts = createAboutStatements(
      sym('https://page.example/'),
      [
        st(
          sym('https://page.example/#thing'),
          sym('http://any.example'),
          lit('anything')
        ),
      ],
      sym('https://pod.example/webclip/1')
    );
    expect(abouts).toEqual([
      st(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://page.example/#thing'),
        sym('https://pod.example/webclip/1')
      ),
    ]);
  });

  it('no about statement is created if the thing is object of another statement', () => {
    const thing = sym('https://page.example/#secondlevel');
    const abouts = createAboutStatements(
      sym('https://page.example/'),
      [
        st(thing, sym('http://any.example'), lit('anything')),
        st(
          sym('https://page.example/#toplevel'),
          sym('http://other.example'),
          thing
        ),
      ],
      sym('https://pod.example/webclip/1')
    );
    expect(abouts).toEqual([
      st(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://page.example/#toplevel'),
        sym('https://pod.example/webclip/1')
      ),
    ]);
  });

  it('only one about statement is created if there are several statements about a thing', () => {
    const thing = sym('https://page.example/#thing');
    const abouts = createAboutStatements(
      sym('https://page.example/'),
      [
        st(thing, sym('http://any.example'), lit('anything')),
        st(thing, sym('http://other.example'), lit('anything')),
      ],
      sym('https://pod.example/webclip/1')
    );
    expect(abouts).toEqual([
      st(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        thing,
        sym('https://pod.example/webclip/1')
      ),
    ]);
  });

  it('the page is not about itself', () => {
    const page = sym('https://page.example/');
    const abouts = createAboutStatements(
      page,
      [
        st(page, sym('http://any.example'), lit('anything')),
        st(page, sym('http://other.example'), lit('anything')),
      ],
      sym('https://pod.example/webclip/1')
    );
    expect(abouts).toEqual([]);
  });
});
