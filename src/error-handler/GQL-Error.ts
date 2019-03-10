/**
 * GraphQL err handler
 */
import { GraphQLError } from 'graphql';
import * as serializeError from 'serialize-error';

import { RequestErrorType, ERROR_DEFINITIONS } from './RequestError';
export { RequestErrorType as GQLErrType };

export class GQLErr extends GraphQLError {
  public err: string;
  public statusCode: number;
  public message: string;
  public details: any;

  private errType: RequestErrorType;

  constructor(
    errorType: RequestErrorType,
    details?: any,
    statusCode?: number,
    message?: string,
  ) {
    super('The request is invalid.');

    // for accessing member functions
    this.errType = errorType;

    this.err = RequestErrorType[errorType];
    this.statusCode = statusCode || this.getStatusCode();
    this.message = message || this.getMessage();
    this.details = serializeError(details);
  }
  private getStatusCode() {
    return ERROR_DEFINITIONS[this.errType].statusCode;
  }

  private getMessage() {
    return ERROR_DEFINITIONS[this.errType].message;
  }
}
