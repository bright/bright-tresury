import { useState } from 'react'
import { AxiosError } from 'axios'

export type ErrorType = AxiosError

export const useError = () => {
    const [error, setError] = useState<ErrorType | undefined>(undefined)

    return {
        error,
        setError,
    }
}
