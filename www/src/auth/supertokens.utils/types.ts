import { User } from 'supertokens-auth-react/lib/build/recipe/authRecipe/types'

export type SubmitNewPasswordAPIResponse =
    | {
          status: 'OK' | 'RESET_PASSWORD_INVALID_TOKEN_ERROR'
      }
    | {
          status: 'FIELD_ERROR'
          formFields: {
              id: string
              error: string
          }[]
      }
export type SendPasswordResetEmailAPIResponse =
    | {
          status: 'OK'
      }
    | {
          status: 'FIELD_ERROR'
          formFields: {
              id: string
              error: string
          }[]
      }
export type SignUpAPIResponse =
    | {
          status: 'OK'
          user: User
      }
    | {
          status: 'FIELD_ERROR'
          formFields: {
              id: string
              error: string
          }[]
      }
export type SignInAPIResponse =
    | {
          status: 'OK'
          user: User
      }
    | {
          status: 'FIELD_ERROR'
          formFields: {
              id: string
              error: string
          }[]
      }
    | {
          status: 'WRONG_CREDENTIALS_ERROR'
      }
export type SendVerifyEmailAPIResponse = {
    status: 'EMAIL_ALREADY_VERIFIED_ERROR' | 'OK'
}
export type FormFieldError = {
    id: string
    error: string
}
