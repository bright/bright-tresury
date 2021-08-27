import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { UseMutationResult } from 'react-query/types/react/types'
import { useHistory } from 'react-router'
import * as Yup from 'yup'
import FormFooter from '../../../../components/form/footer/FormFooter'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../../components/form/footer/FormFooterErrorBox'
import ContactInput from '../../../../idea-proposal-details/form/ContactInput'
import ContentInput from '../../../../idea-proposal-details/form/ContentInput'
import FieldInput from '../../../../idea-proposal-details/form/FieldInput'
import LinkInput, { linksValidationSchema } from '../../../../idea-proposal-details/form/LinksInput'
import PortfolioInput from '../../../../idea-proposal-details/form/PorfolioInput'
import TitleInput, { titleValidationSchema } from '../../../../idea-proposal-details/form/TitleInput'
import { IdeaProposalDetailsDto } from '../../../../idea-proposal-details/idea-proposal-details.dto'
import { useNetworks } from '../../../../networks/useNetworks'
import { ROUTE_PROPOSALS } from '../../../../routes/routes'
import { MutateProposalDetailsParams } from '../proposal-details.api'
import { ProposalDetailsDto } from '../proposal-details.dto'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

interface OwnProps {
    details: IdeaProposalDetailsDto
    proposalIndex: number
    useMutation: () => UseMutationResult<ProposalDetailsDto, unknown, MutateProposalDetailsParams>
}

export type ProposalDetailsFormProps = OwnProps

const ProposalDetailsForm = ({ details, proposalIndex, useMutation }: ProposalDetailsFormProps) => {
    const classes = useStyles()
    const { network } = useNetworks()
    const { t } = useTranslation()
    const history = useHistory()

    const { mutateAsync, isError } = useMutation()

    const onSubmit = async (values: IdeaProposalDetailsDto) => {
        await mutateAsync(
            {
                proposalIndex,
                network: network.id,
                dto: {
                    ...values,
                    links: values.links?.filter((link) => !!link && link !== ''),
                },
            },
            {
                onSuccess: () => {
                    history.push(ROUTE_PROPOSALS)
                },
            },
        )
    }

    const validationSchema = Yup.object({
        title: titleValidationSchema(t),
        links: linksValidationSchema(t),
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={details}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    <TitleInput />
                    <FieldInput placeholder={t('proposal.details.field')} label={t('proposal.details.field')} />
                    <ContentInput placeholder={t('proposal.details.content')} label={t('proposal.details.content')} />
                    <ContactInput />
                    <PortfolioInput />
                    <LinkInput links={values.links} />
                    <FormFooter>
                        {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                        <FormFooterButtonsContainer>
                            <FormFooterButton type={'submit'} variant={'contained'}>
                                {t('proposal.details.form.edit')}
                            </FormFooterButton>
                        </FormFooterButtonsContainer>
                    </FormFooter>
                </form>
            )}
        </Formik>
    )
}
export default ProposalDetailsForm
