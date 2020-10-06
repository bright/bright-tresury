import {
  BadRequestException,
  ConflictException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
  UnknownException,
  UnprocessableEntityException,
} from './exceptions'
import { HttpStatus } from './httpStatus'

const NODE_ENV = process.env.NODE_ENV
export const API_PREFIX = NODE_ENV === 'development' ? 'http://localhost:3001/' : '/'
export const API_URL = `${API_PREFIX}api`

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface APIRequest {
  method: HttpMethod
  url: string
  options?: any
}

export function jsonHeaders(): HeadersInit {
  return new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })
}

const verifyResponse = async (response: Response) => {
  if (response.status === HttpStatus.UNAUTHORIZED) {
    throw new UnauthorizedException()
  }
  if (response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
    throw new UnprocessableEntityException()
  }
  if (response.status === HttpStatus.CONFLICT) {
    throw new ConflictException()
  }
  if (response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
    throw new InternalServerException()
  }
  if (response.status === HttpStatus.NOT_FOUND) {
    const error = await response.json()
    let message = ''
    if (error && error.message) {
      message = error.message
    }
    throw new NotFoundException(message)
  }
  if (response.status === HttpStatus.BAD_REQUEST) {
    throw new BadRequestException()
  }

  if (!response.ok) {
    throw new UnknownException()
  }
}

export async function fetchAndUnwrapFiles<T>(method: HttpMethod, url: string, body: FormData): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: jsonHeaders(),
    body,
  })
  if (response.status === HttpStatus.NO_CONTENT) {
    return {} as T
  }
  await verifyResponse(response)
  return (await response.json()) as Promise<T>
}

export async function fetchAndUnwrap<T>(method: HttpMethod, url: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: jsonHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })
  if (response.status === HttpStatus.NO_CONTENT) {
    return {} as T
  }
  await verifyResponse(response)
  return (await response.json()) as Promise<T>
}

export async function fetchVoid(method: HttpMethod, url: string, body?: any): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: jsonHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })
  await verifyResponse(response)
}

export async function fetchFile(method: HttpMethod, url: string, body?: any): Promise<Blob> {
  const response = await fetch(url, {
    method,
    headers: jsonHeaders(),
  })
  await verifyResponse(response)
  return await response.blob()
}

export async function fetchRetryAndUnwrap<T>({
  method,
  url,
  retryTimes,
  options,
}: {
  retryTimes: number
} & APIRequest): Promise<T> {
  try {
    return await fetchAndUnwrap(method, url, options)
  } catch (err) {
    if (retryTimes === 1) throw err
    return await fetchRetryAndUnwrap({ method, url, options, retryTimes: retryTimes - 1 })
  }
}
