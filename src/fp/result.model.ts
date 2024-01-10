type Ok<T> = { status: 'ok', content: T }
type Ko = { status: 'error', error: Error }

export type Result<T> = Ok<T> | Ko;

export const ok = <T>(content: T): Result<T> => {
    return {status: 'ok', content};
}

export const ko = <T>(error: Error): Result<T> => {
    return {status: 'error', error};
}