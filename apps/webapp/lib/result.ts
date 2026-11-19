// the one response shape. every server action and api route returns a Result

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "INTERNAL";

export type ResultError = {
  code: ErrorCode;
  message: string;
  // per-field messages, so forms can show them under the right input
  fields?: Record<string, string>;
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: ResultError };

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = { items: T[]; meta: PageMeta };

// throw this anywhere inside an action, the wrapper turns it into a Result
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export const unauthorized = (message = "Please sign in again") =>
  new AppError("UNAUTHORIZED", message);
export const forbidden = (message = "You can't do that") =>
  new AppError("FORBIDDEN", message);
export const notFound = (message = "Not found") =>
  new AppError("NOT_FOUND", message);
export const conflict = (message: string) => new AppError("CONFLICT", message);

export const HTTP_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 422,
  CONFLICT: 409,
  INTERNAL: 500,
};
