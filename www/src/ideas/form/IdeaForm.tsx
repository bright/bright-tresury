import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import FormFooter from '../../components/form/footer/FormFooter'
import { formatAddress } from '../../components/identicon/utils'
import { Network } from '../../networks/networks.dto'
import { useNetworks } from '../../networks/useNetworks'
import { isValidAddressOrEmpty } from '../../util/addressValidator'
import { Nil } from '../../util/types'
import { EditIdeaDto, EditIdeaNetworkDto, IdeaDto } from '../ideas.dto'
import FoldedIdeaFormFields from './FoldedIdeaFormFields'
import IdeaFormFields from './IdeaFormFields'

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
    idea?: IdeaDto
    onSubmit: (idea: EditIdeaDto) => void
    extendedValidation?: boolean
    foldable?: boolean
}

export type IdeaFormProps = PropsWithChildren<OwnProps>

export interface IdeaFormValues {
    beneficiary: string
    currentNetwork: EditIdeaNetworkDto
    otherNetworks: EditIdeaNetworkDto[]
    title: string
    field?: string
    content: string
    contact?: string
    portfolio?: string
    links?: string[]
}

const toFormValues = (idea: Nil<IdeaDto>, network: Network): IdeaFormValues => {
    if (!idea) {
        return {
            beneficiary: '',
            currentNetwork: { name: network.id, value: 0 },
            otherNetworks: [],
            title: '',
            field: '',
            content: '',
            portfolio: '',
            links: [''],
            contact: '',
        }
    }
    return {
        beneficiary: formatAddress(idea.beneficiary, network.ss58Format, false),
        currentNetwork: idea.currentNetwork,
        otherNetworks: idea.additionalNetworks,
        ...idea.details,
        links: idea.details.links && idea.details.links.length > 0 ? idea.details.links : [''],
    }
}

const IdeaForm = ({ idea, onSubmit, extendedValidation, foldable, children }: IdeaFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [folded, setFolded] = useState(!!foldable)
    const { network } = useNetworks()

    const validationSchema = Yup.object({
        title: Yup.string().required(t('idea.details.form.emptyFieldError')),
        beneficiary: Yup.string().test('validate-address', t('idea.details.form.wrongBeneficiaryError'), (address) => {
            return isValidAddressOrEmpty(address, network.ss58Format)
        }),
        otherNetworks: Yup.array().of(
            Yup.object().shape({
                value: Yup.number().min(0, t('idea.details.form.valueCannotBeLessThanZero')),
            }),
        ),
        currentNetwork: Yup.object().shape({
            value: Yup.number().min(0, t('idea.details.form.valueCannotBeLessThanZero')),
        }),
        links: Yup.array().of(
            Yup.string().url(t('idea.details.form.badLinkError')).max(1000, t('idea.details.form.linkTooLong')),
        ),
    })

    const extendedValidationSchema = Yup.object().shape({
        beneficiary: Yup.string().required(t('idea.details.form.emptyFieldError')),
        currentNetwork: Yup.object().shape({
            value: Yup.number()
                .required(t('idea.details.form.emptyFieldError'))
                .moreThan(0, t('idea.details.form.nonZeroFieldError')),
        }),
    })

    const noEmptyLinks = (links: string[] | undefined) => links?.filter((link: string) => Boolean(link))

    const onFormikSubmit = (formIdea: IdeaFormValues) => {
        let editedIdea = {
            beneficiary: formIdea.beneficiary,
            additionalNetworks: formIdea.otherNetworks,
            currentNetwork: formIdea.currentNetwork,
            details: {
                title: formIdea.title,
                contact: formIdea.contact,
                content: formIdea.content,
                field: formIdea.field,
                portfolio: formIdea.portfolio,
                links: noEmptyLinks(formIdea.links),
            },
        }
        return onSubmit(editedIdea)
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={toFormValues(idea, network)}
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
