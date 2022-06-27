import { Parser as SparqlParser, Update } from 'sparqljs';

export function thenSparqlUpdateIsSentToUrl(
  fetchMock: jest.Mock,
  url: string,
  query: string
) {
  expect(fetchMock).toHaveBeenCalled();

  const parser = new SparqlParser();

  const calls = (fetchMock as jest.Mock).mock.calls;
  const sparqlUpdateCall = calls.find(
    (it) => it[0] === url && it[1].method === 'PATCH'
  );

  expect(sparqlUpdateCall).toBeDefined();

  const body = sparqlUpdateCall[1].body;
  const actualQuery = parser.parse(body) as Update;
  const expectedQuery = parser.parse(query) as Update;
  expect(actualQuery).toEqual(expectedQuery);
}

export function thenNoSparqlUpdateIsSentToUrl(
  authenticatedFetch: jest.Mock,
  url: string
) {
  const calls = authenticatedFetch.mock.calls;
  const sparqlUpdateCall = calls.find(
    (it) => it[0] === url && it[1].method === 'PATCH'
  );

  expect(sparqlUpdateCall).not.toBeDefined();
}
