import { ObjectSchema } from 'yup'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface UseNewPasswordFormResult {
    validationSchema: ObjectSchema<any>
    passwordValidationRules: string[]
}

const useNewPasswordValidation = (): UseNewPasswordFormResult => {
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, t('auth.signUp.emailSignUp.form.password.tooShort'))
            .matches(/[a-z]+/, t('auth.signUp.emailSignUp.form.password.useLowerCaseLetter'))
            .matches(/[0-9]+/, t('auth.signUp.emailSignUp.form.password.useNumber')),
    })

    const passwordValidationRules = validationSchema.fields.password.tests.map(
        ({ OPTIONS }) => OPTIONS.message?.toString() || '',
    )

    return {
        validationSchema,
        passwordValidationRules,
    }
}

export default useNewPasswordValidation
