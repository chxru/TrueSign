import type { Request, Response } from 'express';
import type { Query as Q, Send } from 'express-serve-static-core';

/**
 * Express Request with body and query types
 */
export interface ExpressRequest<Body, Query extends Q = Q> extends Request {
  body: Body;
  query: Query;
}

interface ExpressErrorResponse {
  error: string;
  data?: unknown;
}

export interface ExpressResponse<T> extends Response {
  send: Send<T | ExpressErrorResponse, this>;
}
