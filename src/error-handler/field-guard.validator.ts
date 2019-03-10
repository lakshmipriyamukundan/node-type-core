import { Request } from 'express';
import { RequestError, RequestErrorType } from './RequestError';

interface InterfaceFieldGuard {
  limit: number;
  offset: number;
  order: 'ASC' | 'DESC';
}

export const fieldGuard = (
  req: Request,
  queryables: string[],
  dataLocation: 'body' | 'params' | 'query' = 'body',
): InterfaceFieldGuard => {
  // find limit and offset and then delete it
  const limit =
    +req.query._limit || +req.body._limit || +req.params._limit || 50;
  const offset =
    +req.query._offset || +req.body._offset || +req.params._offset || 0;
  let order: string =
    req.query._order || req.body._order || req.params._order || 'DESC';

  // remove fields
  delete req.query._limit;
  delete req.body._limit;
  delete req.params._limit;

  delete req.query._order;
  delete req.body._order;
  delete req.params._order;

  delete req.query._offset;
  delete req.body._offset;
  delete req.params._offset;

  order = order.toUpperCase(); // ASC/DESC

  if (limit < 0 || offset < 0 || (order !== 'DESC' && order !== 'ASC')) {
    throw new RequestError(RequestErrorType.UNPROCESSABLE_ENTITY, {
      details: '_limit and _offset should be +ve and _order = ASC/DESC',
    });
  }

  // check if any unwanted fields present

  const incomingFieldKeys = Object.keys(req[dataLocation]);

  if (!incomingFieldKeys.every(key => queryables.indexOf(key) >= 0)) {
    throw new RequestError(RequestErrorType.UNPROCESSABLE_ENTITY, {
      details: 'un-recognized arguments found',
    });
  }

  return { limit, offset, order };
};
