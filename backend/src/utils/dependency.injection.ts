import { FactoryProvider } from "@nestjs/common/interfaces";

export interface AsyncFactoryProvider<T> extends FactoryProvider {
    provide: string
    useFactory: (...args: any[]) => Promise<T> | T
}

export function propertyOfProvider<T>(
    parentProvider: AsyncFactoryProvider<T>,
    property: keyof T,
    name: string): AsyncFactoryProvider<T[typeof property]> {
    return {
        provide: name,
        useFactory: (parent: T) => parent[property],
        inject: [parentProvider.provide]
    };
}
