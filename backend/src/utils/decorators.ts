type Decorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator
type GenericDecorator = (target: object, key?: any, descriptor?: any) => any
export const compose = (...decorators: Decorator[]) => {
    const composed: GenericDecorator = (target: object, descriptor?: string | symbol, args?: any) => {
        return decorators.reduce(
            (result, decorator) => (decorator as GenericDecorator)(result, descriptor, args),
            target,
        )
    }
    return composed
}
