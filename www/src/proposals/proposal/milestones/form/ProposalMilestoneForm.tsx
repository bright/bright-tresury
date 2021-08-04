import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import FormFooter from '../../../../components/form/footer/FormFooter'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'
import { Nil } from '../../../../util/types'
import ProposalMilestoneFormFields from './fields/ProposalMilestoneFormFields'
import useProposalMilestoneForm from './useProposalMilestoneForm'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
    }),
)

export interface ProposalMilestoneFormValues {
    subject: string
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
}

interface OwnProps {
    milestone?: ProposalMilestoneDto
    readonly: boolean
    onSubmit?: (values: ProposalMilestoneFormValues) => void
    onCancel: () => void
}

export type ProposalMilestoneFormProps = PropsWithChildren<OwnProps>

const ProposalMilestoneForm = ({ readonly, milestone, onSubmit, onCancel }: ProposalMilestoneFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { initialValues, validationSchema, onSubmitFallback } = useProposalMilestoneForm({
        milestone,
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{ ...initialValues }}
            validationSchema={validationSchema}
            onSubmit={onSubmit ?? onSubmitFallback}
        >
            {({ handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    <ProposalMilestoneFormFields readonly={readonly} />
                    <FormFooter>
                        <FormFooterButtonsContainer>
                            {!readonly ? (
                                <FormFooterButton type={'submit'} variant={'contained'}>
                                    {t('proposal.milestones.modal.form.buttons.save')}
                                </FormFooterButton>
                            ) : null}
                            <FormFooterButton type={'button'} variant={'text'} onClick={onCancel}>
                                {t('proposal.milestones.modal.form.buttons.cancel')}
                            </FormFooterButton>
                        </FormFooterButtonsContainer>
                    </FormFooter>
                </form>
            )}
        </Formik>
    )
}

export default ProposalMilestoneForm
