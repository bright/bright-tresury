import { CannotExecuteNotConnectedError } from 'typeorm/error/CannotExecuteNotConnectedError'

interface Closeable {
    close(): void | Promise<void>
}

function isCloseable(x: unknown): x is Closeable {
    if (typeof x === 'object' && x != null) {
        const close = (x as any).close
        return typeof close === 'function'
    }
    return false
}

export async function tryClose(result: unknown) {
    if (isCloseable(result)) {
        try {
            await result.close()
        } catch (e) {
            if (!(e instanceof CannotExecuteNotConnectedError)) {
                throw e
            }
        }
    }
}
