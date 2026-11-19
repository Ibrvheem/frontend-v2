import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser, type SessionUser } from "@/lib/auth/server";
import {
  AppError,
  HTTP_STATUS,
  unauthorized,
  type Result,
  type ResultError,
} from "@/lib/result";

// turns anything thrown into a ResultError
function toError(e: unknown): ResultError {
  if (e instanceof AppError) {
    return { code: e.code, message: e.message, fields: e.fields };
  }
  if (e instanceof z.ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of e.issues) {
      const key = issue.path.join(".");
      if (key && !fields[key]) fields[key] = issue.message;
    }
    return { code: "VALIDATION", message: "Please check the form", fields };
  }
  // unknown errors get logged, the user just sees a generic message
  console.error(e);
  return { code: "INTERNAL", message: "Something went wrong, please try again" };
}

type Ctx<I, U> = { input: I; user: U };

// signed-in action (the default)
export function action<S extends z.ZodTypeAny, O>(
  opts: { input: S; public?: false },
  fn: (ctx: Ctx<z.infer<S>, SessionUser>) => Promise<O>,
): (input: z.input<S>) => Promise<Result<O>>;
// public action, user may be null
export function action<S extends z.ZodTypeAny, O>(
  opts: { input: S; public: true },
  fn: (ctx: Ctx<z.infer<S>, SessionUser | null>) => Promise<O>,
): (input: z.input<S>) => Promise<Result<O>>;
export function action<S extends z.ZodTypeAny, O>(
  opts: { input: S; public?: boolean },
  fn: (ctx: Ctx<z.infer<S>, SessionUser>) => Promise<O>,
) {
  return async (raw: z.input<S>): Promise<Result<O>> => {
    try {
      const user = await getUser();
      if (!user && !opts.public) throw unauthorized();
      const input = opts.input.parse(raw);
      // user is only null on public actions, and those accept null
      return { ok: true, data: await fn({ input, user: user as SessionUser }) };
    } catch (e) {
      return { ok: false, error: toError(e) };
    }
  };
}

// same idea for api routes: return data, throw errors, get a Result back as json
export function route<P = Record<string, string>>(
  fn: (req: Request, ctx: { params: Promise<P> }) => Promise<unknown>,
) {
  return async (req: Request, ctx: { params: Promise<P> }) => {
    try {
      const data = await fn(req, ctx);
      return NextResponse.json({ ok: true, data });
    } catch (e) {
      const error = toError(e);
      return NextResponse.json({ ok: false, error }, { status: HTTP_STATUS[error.code] });
    }
  };
}
