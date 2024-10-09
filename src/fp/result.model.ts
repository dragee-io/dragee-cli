type Ok<T> = { status: 'ok'; content: T };
type Ko = { status: 'error'; error: unknown };

export type Result<T> = Ok<T> | Ko;

export const ok = <T>(content: T): Result<T> => {
    return { status: 'ok', content };
};

export const ko = <T>(error: unknown): Result<T> => {
    return { status: 'error', error };
};
