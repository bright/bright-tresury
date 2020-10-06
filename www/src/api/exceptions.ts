class BaseException extends Error {
  constructor(message?: string) {
    super(message)
    // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class UnknownException extends BaseException {}

export class ConflictException extends BaseException {}

export class ForbiddenException extends BaseException {}

export class UnauthorizedException extends BaseException {}

export class InternalServerException extends BaseException {}

export class NotFoundException extends BaseException {}

export class BadRequestException extends BaseException {}

export class UnprocessableEntityException extends BaseException {}
