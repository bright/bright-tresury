import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import FormFooter from '../../../components/form/footer/FormFooter'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../components/form/footer/FormFooterErrorBox'
import { networkValueValidationSchema } from '../../../components/form/input/networkValue/NetworkValueInput'
import { Label } from '../../../components/text/Label'
import { breakpoints } from '../../../theme/theme'
import IdeaNetworkValueInput from '../../form/networks/IdeaNetworkValueInput'
import { IDEA_QUERY_KEY_BASE, usePatchIdeaNetwork } from '../../ideas.api'
import { IdeaDto } from '../../ideas.dto'
import { toNetworkDisplayValue, toNetworkPlanckValue } from '../../../util/quota.util'
import { useNetworks } from '../../../networks/useNetworks'
import { NetworkDisplayValue } from '../../../util/types'
import User from '../../../components/user/User'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        text: {
            fontSize: '14px',
            fontWeight: 500,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '16px',
            },
        },
        spacing: {
            marginTop: '2em',
        },
    }),
)

interface TurnPendingIdeaIntoProposalFormValues {
    value: NetworkDisplayValue
}

interface OwnProps {
    idea: IdeaDto
    submitProposalModalOpen: () => void
}

export type TurnPendingIdeaIntoProposalFormProps = OwnProps

const TurnPendingIdeaIntoProposalForm = ({ idea, submitProposalModalOpen }: TurnPendingIdeaIntoProposalFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()

    const queryClient = useQueryClient()
    const { mutateAsync: patchMutateAsync, isError } = usePatchIdeaNetwork()
    const { network, findNetwork } = useNetworks()

    const onsubmit = async (values: TurnPendingIdeaIntoProposalFormValues) => {
        const ideaNetwork = {
            ...idea.currentNetwork,
            value: toNetworkPlanckValue(values.value, network.decimals)!,
        }
        await patchMutateAsync(
            { ideaId: idea.id, ideaNetwork },
            {
                onSuccess: (patchedIdeaNetwork) => {
                    queryClient.setQueryData([IDEA_QUERY_KEY_BASE, idea!.id], {
                        ...idea,
                        currentNetwork: patchedIdeaNetwork,
                    })
                    submitProposalModalOpen()
                },
            },
        )
    }

    const validationSchema = Yup.object({
        value: networkValueValidationSchema({ t, findNetwork, required: true, nonZero: true }),
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                name: idea.currentNetwork.name,
                value: toNetworkDisplayValue(idea.currentNetwork.value, network.decimals),
            }}
            validationSchema={validationSchema}
            onSubmit={onsubmit}
        >
            {({ values, handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    <Label label={t('ideaProposalDetails.title')} />
                    <text className={classes.text}>{idea.details.title}</text>
                    <Label className={classes.spacing} label={t('idea.details.beneficiary')} />
                    {idea.beneficiary ? <User user={idea.beneficiary} ellipsis={false} /> : null}
                    <IdeaNetworkValueInput
                        className={classes.spacing}
                        inputName={'value'}
                        networkId={values.name}
                        value={values.value}
                    />
                    <FormFooter>
                        {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                        <FormFooterButtonsContainer>
                            <FormFooterButton type={'submit'} variant={'contained'}>
                                {t('idea.turnIntoProposal.submit')}
                            </FormFooterButton>

                            <FormFooterButton type={'button'} variant={'outlined'} onClick={history.goBack}>
                                {t('idea.turnIntoProposal.cancel')}
                            </FormFooterButton>
                        </FormFooterButtonsContainer>
                    </FormFooter>
                </form>
            )}
        </Formik>
    )
}

export default TurnPendingIdeaIntoProposalForm
