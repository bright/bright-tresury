export interface Accessor<T> {
    (): T

    get(): T

    set(newValue: T): void
}
