type Some<T> = { value: T };
type None = { value: null };
type OrElse<T> = (defaultValue: (context: any) => Promise<T>) => Promise<T>;

export type Maybe<T> = (Some<T> | None) & {
    orElse: OrElse<T>
};

const orElse = <T>(value: T | null) => <T>(defaultValue: () => Promise<T>) => {
    return value === null ? defaultValue() : Promise.resolve(value);
};


export const some = <T>(value: T): Maybe<T> => {
    if (!value) {
        throw Error("Provided value must not be empty");
    }
    return { value, orElse: orElse(value) };
}

export const none = <T>(): Maybe<T> => {
    return { value: null, orElse: orElse(null) };
}