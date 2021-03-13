import {FormikErrors} from "formik/dist/types";
import {useCallback, useEffect, useRef, useState} from "react";
import {FormBaseAPIResponse, FormFieldError} from "supertokens-auth-react/lib/build/recipe/emailpassword/types";
import {LoadingState} from "../../components/loading/LoadingWrapper";

interface UseSuperTokensRequestResult<Values> {
    call: (params: Values, setErrors?: (errors: FormikErrors<Values>) => void) => Promise<void>
    loadingState: LoadingState
    error?: string
}

enum SuperTokensLoadingState { FieldError }

export function useSuperTokensRequest<Values>(
    apiCall: (params: Values) => Promise<FormBaseAPIResponse>
): UseSuperTokensRequestResult<Values> {
    const ref = useRef(true)

    const [error, setError] = useState<string | undefined>()
    const [loadingState, setLoadingState] = useState<LoadingState | SuperTokensLoadingState>(LoadingState.Initial)

    const call = useCallback(async (values: Values, setErrors?: (errors: FormikErrors<Values>) => void) => {
        startLoading()
        apiCall(values).then(async (response: FormBaseAPIResponse) => {
            switch (response.status) {
                case "OK":
                    handleSuccess()
                    break
                case "FIELD_ERROR":
                    await handleFieldError(response.formFields, setErrors)
                    break
                case "GENERAL_ERROR":
                    handleGeneralError(response.message)
            }
        }).catch((error) => {
            handleGeneralError(error)
        })
    }, [apiCall])

    const startLoading = () => {
        setLoadingState(LoadingState.Loading)
        setError(undefined)
    }

    const handleSuccess = () => {
        setLoadingState(LoadingState.Resolved)
    }

    const handleFieldError = async (formFields: FormFieldError[], setErrors?: (errors: FormikErrors<Values>) => void) => {
        if (setErrors) {
            const errors: any = {}
            formFields.forEach(({id, error}) => {
                errors[id] = error
            })
            await setErrors(errors)
        }
        setLoadingState(SuperTokensLoadingState.FieldError)
    }

    const handleGeneralError = (error: string) => {
        setError(error)
        setLoadingState(LoadingState.Error)
    }

    useEffect(() => {
        return () => {
            ref.current = false
        }
    }, [])

    return {loadingState, call, error} as UseSuperTokensRequestResult<Values>
}
