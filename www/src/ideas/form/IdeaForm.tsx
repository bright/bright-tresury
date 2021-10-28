import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import FormFooter from '../../components/form/footer/FormFooter'
import { formatAddress } from '../../components/identicon/utils'
import { linksValidationSchema } from '../../idea-proposal-details/form/LinksInput'
import { titleValidationSchema } from '../../idea-proposal-details/form/TitleInput'
import { Network } from '../../networks/networks.dto'
import { useNetworks } from '../../networks/useNetworks'
import { isValidAddressOrEmpty } from '../../util/addressValidator'
import { NetworkDisplayValue, Nil } from '../../util/types'
import { EditIdeaDto, EditIdeaNetworkDto, IdeaDto, IdeaNetworkDto } from '../ideas.dto'
import FoldedIdeaFormFields from './FoldedIdeaFormFields'
import IdeaFormFields from './IdeaFormFields'
import { toNetworkDisplayValue } from '../../util/quota.util'
import useIdeaForm, { IdeaFormValues } from './useIdeaForm'

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

const IdeaForm = ({ idea, onSubmit, extendedValidation, foldable, children }: IdeaFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [folded, setFolded] = useState(!!foldable)
    const {
        validationSchema,
        extendedValidationSchema,
        toFormValues,
        toEditIdeaDto
    } = useIdeaForm()


    const onFormikSubmit = (formIdea: IdeaFormValues) => onSubmit(toEditIdeaDto(formIdea))

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
