import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import IdeaFormFields from './IdeaFormFields'
import FoldedIdeaFormFields from './FoldedIdeaFormFields'
import { isValidAddressOrEmpty } from '../../util/addressValidator'
import { IdeaDto, IdeaNetworkDto } from '../ideas.dto'
import FormFooter from '../../components/form/footer/FormFooter'

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

interface OwnProps {
    idea: IdeaDto
    onSubmit: (idea: IdeaDto) => void
    extendedValidation?: boolean
    foldable?: boolean
}

export type IdeaFormProps = PropsWithChildren<OwnProps>

export interface IdeaFormValues {
    beneficiary: string
    networks: IdeaNetworkDto[]
    title: string
    field?: string
    content: string
    contact?: string
    portfolio?: string
    links?: string[]
}

const toFormValues = (idea: IdeaDto): IdeaFormValues => {
    return {
        beneficiary: idea.beneficiary,
        networks: idea.networks,
        ...idea.details,
        links: idea.details.links && idea.details.links.length > 0 ? idea.details.links : [''],
    }
}

const IdeaForm = ({ idea, onSubmit, extendedValidation, foldable, children }: IdeaFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [folded, setFolded] = useState(!!foldable)

    const validationSchema = Yup.object({
        title: Yup.string().required(t('idea.details.form.emptyFieldError')),
        beneficiary: Yup.string().test('validate-address', t('idea.details.form.wrongBeneficiaryError'), (address) => {
            return isValidAddressOrEmpty(address)
        }),
        networks: Yup.array().of(
            Yup.object().shape({
                value: Yup.number().min(0, t('idea.details.form.valueCannotBeLessThanZero')),
            }),
        ),
        links: Yup.array().of(
            Yup.string().url(t('idea.details.form.badLinkError')).max(1000, t('idea.details.form.linkTooLong')),
        ),
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

    const noEmptyLinks = (links: string[] | undefined) => links?.filter((link: string) => Boolean(link))

    const onFormikSubmit = (formIdea: IdeaFormValues) =>
        onSubmit({
            ...idea,
            beneficiary: formIdea.beneficiary,
            networks: formIdea.networks,
            details: {
                title: formIdea.title,
                contact: formIdea.contact,
                content: formIdea.content,
                field: formIdea.field,
                portfolio: formIdea.portfolio,
                links: noEmptyLinks(formIdea.links),
            },
        })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={toFormValues(idea)}
            validationSchema={extendedValidation ? validationSchema.concat(extendedValidationSchema) : validationSchema}
            onSubmit={onFormikSubmit}
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
                    <FormFooter>{children}</FormFooter>
                </form>
            )}
        </Formik>
    )
}

export default IdeaForm
