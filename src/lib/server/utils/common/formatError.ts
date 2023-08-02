import { error, type HttpError } from '@sveltejs/kit';

export default function formatError(e: unknown): HttpError {
  let msg: string | undefined;
  if (e instanceof Error) {
    try {
      msg = JSON.parse(e.message);
    } catch {
      msg = e.message;
    }
  }
  return error(400, msg || 'Unknown Error');
}
