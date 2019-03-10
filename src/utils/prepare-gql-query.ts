export function prepareGQLQuery(query: string | { [key: string]: any }) {
  let preparedQuery: { [key: string]: any };

  if (typeof query === 'string') {
    preparedQuery = JSON.parse(query);
  } else if (typeof query === 'object') {
    let temp = JSON.stringify(query);
    temp = temp.replace(/__/gi, '$');
    preparedQuery = JSON.parse(temp);
  }
  return preparedQuery;
}
