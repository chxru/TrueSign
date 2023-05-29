import type { Request, Response } from 'express';
import type { Query as Q, Send } from 'express-serve-static-core';

/**
 * Express Request with body and query types
 */
export interface ExpressRequest<Body = unknown, Query extends Q = Q>
  extends Request {
  body: Body;
  query: Query;
}

interface ExpressErrorResponse {
  error: string;
  data?: unknown;
}

export interface ExpressResponse<T = unknown> extends Response {
  send: Send<T | ExpressErrorResponse, this>;
}
