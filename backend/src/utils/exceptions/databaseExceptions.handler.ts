import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { NotFoundException } from '@nestjs/common'

export function handleFindError(error: Error, message?: string): never | Error {
    if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(message || 'Entity not found')
    }
    return error
}
