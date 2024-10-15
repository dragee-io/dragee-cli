export type Nullable<T> = T | null;
export type AsyncNullable<T> = Promise<Nullable<T>>;
export type OrElse<T> = (defaultValueFn: () => AsyncNullable<T>) => AsyncNullable<T>;
export type OrElseGet<T> = (defaultValueFn: () => Promise<Maybe<T>>) => Promise<Maybe<T>>;

export type Maybe<T> = {
    value: T | null;
    orElse: OrElse<T>;
    orElseGet: OrElseGet<T>;
    ifPresent: (callback: (value: T) => void) => void;
};

export const none = <T>(): Maybe<T> => ({
    value: null,
    orElse: (defaultValueFn: () => AsyncNullable<T>) => defaultValueFn(),
    orElseGet: (defaultValueFn: () => Promise<Maybe<T>>) => defaultValueFn(),
    ifPresent: (callback: (value: T) => void) => ({})
});

export const some = <T>(value: NonNullable<T>): Maybe<T> => ({
    value,
    orElse: (defaultValueFn: () => AsyncNullable<T>) => Promise.resolve(value),
    orElseGet: (defaultValueFn: () => Promise<Maybe<T>>) => Promise.resolve(some(value)),
    ifPresent: (callback: (value: T) => void) => callback(value)
});
