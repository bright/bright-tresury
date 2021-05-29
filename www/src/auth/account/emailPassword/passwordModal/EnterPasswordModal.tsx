import React from 'react'
import { FormFooterButtonsContainer } from '../../../../components/form/footer/FormFooterButtonsContainer'
import { Modal } from '../../../../components/modal/Modal'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../../components/button/Button'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import { PasswordInput } from '../../../../components/form/input/password/PasswordInput'
import * as Yup from 'yup'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        subtitle: {
            marginTop: 12,
            fontSize: 14,
        },
        passwordWrapper: {
            marginTop: 36,
        },
        password: {
            border: '1px solid #7B7B7B43',
        },
        buttonsContainer: {
            marginTop: 24,
        },
    }),
)

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: (password: string) => void
}

export const EnterPasswordModal = ({ open, onClose, onConfirm }: Props) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const onSubmit = (values: { password: string }) => {
        onConfirm(values.password)
    }

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(t('account.passwordModal.passwordRequired')),
    })

    const passwordValidationRules = validationSchema.fields.password.tests.map(
        ({ OPTIONS }) => OPTIONS.message?.toString() || '',
    )

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" fullWidth={false} maxWidth={'md'}>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    password: '',
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ values, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className={classes.root}>
                        <div className={classes.title}>{t('account.passwordModal.title')}</div>
                        <div className={classes.subtitle}>{t('account.passwordModal.subtitle')}</div>
                        <div className={classes.passwordWrapper}>
                            <PasswordInput
                                name="password"
                                className={classes.password}
                                placeholder={t('account.passwordModal.passwordPlaceholder')}
                                label={t('account.passwordModal.passwordLabel')}
                                validationRules={passwordValidationRules}
                            />
                        </div>
                        <div className={classes.buttonsContainer}>
                            <FormFooterButtonsContainer>
                                <Button variant="contained" color="primary" type="submit">
                                    {t('account.passwordModal.confirm')}
                                </Button>
                                <Button variant="text" color="primary" onClick={onClose}>
                                    {t('account.passwordModal.cancel')}
                                </Button>
                            </FormFooterButtonsContainer>
                        </div>
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
