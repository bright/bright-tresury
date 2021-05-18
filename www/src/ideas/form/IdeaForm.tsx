import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { Button } from '../../components/button/Button'
import { ButtonsContainer } from '../../components/form/buttons/ButtonsContainer'
import { IdeaDto } from '../ideas.api'
import IdeaFormFields from './IdeaFormFields'
import FoldedIdeaFormFields from './FoldedIdeaFormFields'
import { isValidAddressOrEmpty } from '../../util/addressValidator'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        foldButton: {
            marginTop: '2em',
            alignSelf: 'flex-start',
        },
    }),
)

interface Props {
    idea: IdeaDto
    onSubmit: (idea: IdeaDto) => void
    extendedValidation?: boolean
    foldable?: boolean
}

const IdeaForm: React.FC<Props> = ({ idea, onSubmit, extendedValidation, foldable, children }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [folded, setFolded] = useState(!!foldable)

    const validationSchema = Yup.object({
        title: Yup.string().required(t('idea.details.form.emptyFieldError')),
        beneficiary: Yup.string().test('validate-address', t('idea.details.form.wrongBeneficiaryError'), (address) => {
            return isValidAddressOrEmpty(address)
        }),
    })

    const extendedValidationSchema = Yup.object().shape({
        beneficiary: Yup.string().required(t('idea.details.form.emptyFieldError')),
        networks: Yup.array().of(
            Yup.object().shape({
                value: Yup.number()
                    .required(t('idea.details.form.emptyFieldError'))
                    .moreThan(0, t('idea.details.form.nonZeroFieldError')),
            }),
        ),
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                ...idea,
                links: idea.links && idea.links.length > 0 ? idea.links : [''],
            }}
            validationSchema={extendedValidation ? validationSchema.concat(extendedValidationSchema) : validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    {folded ? <FoldedIdeaFormFields values={values} /> : <IdeaFormFields values={values} />}
                    {foldable && (
                        <Button
                            className={classes.foldButton}
                            variant="text"
                            color="primary"
                            onClick={() => setFolded(!folded)}
                        >
                            {folded ? t('idea.details.form.showAll') : t('idea.details.form.showLess')}
                        </Button>
                    )}
                    {children}
                    {/*<ButtonsContainer>{children}</ButtonsContainer>*/}
                </form>
            )}
        </Formik>
    )
}

export default IdeaForm
