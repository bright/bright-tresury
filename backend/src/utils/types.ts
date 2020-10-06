export type NullablePropertyNames<T> = {
    [Prop in keyof T]: null extends T[Prop] ? Prop : never
}[keyof T]

type NotNullablePropertyNames<T> = {
    [Prop in keyof T]: null extends T[Prop] ? never : Prop
}[keyof T];

export type FunctionsOf<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never
}

export type FilterKeys<T, Condition> = {
    [K in keyof T]: T[K] extends Condition ? K : never
}[keyof T]

// tslint:disable-next-line:ban-types
export type FunctionsNamesOf<T> = FilterKeys<T, Function>

export type List<T> = ReadonlyArray<T>

export type ReturnOf<T> = T extends () => any ? ReturnType<T> : never

export type Predicate<T> = (item: T) => boolean

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Callable<R> = (...args: any[]) => R;

export type GenericReturnType<R, X> = X extends Callable<R> ? R : never;

export type Type<T> = new(...args: any[]) => T;

// https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-295685298
export function StaticImpelements<T>() {
    return (constructor: T) => {
    }
}
