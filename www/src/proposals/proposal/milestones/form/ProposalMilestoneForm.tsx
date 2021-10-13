import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import FormFooter from '../../../../components/form/footer/FormFooter'
import FormFooterButton from '../../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../../components/form/footer/FormFooterButtonsContainer'
import FormFooterErrorBox from '../../../../components/form/footer/FormFooterErrorBox'
import { useModal } from '../../../../components/modal/useModal'
import { breakpoints, theme } from '../../../../theme/theme'
import DeleteProposalMilestoneModal from '../details/DeleteProposalMilestoneModal'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'
import { Nil } from '../../../../util/types'
import ProposalMilestoneFormFields from './fields/ProposalMilestoneFormFields'
import useProposalMilestoneForm from './useProposalMilestoneForm'

const useStyles = makeStyles((theme) =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        buttonsContainer: {
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
        },
        removeButton: {
            whiteSpace: 'nowrap',
            marginLeft: '10px',
            color: `${theme.palette.warning.main}`,
        },
        cancelButton: {
            marginRight: '40px',
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
    readonly: boolean
    onCancel: () => void
    milestone?: ProposalMilestoneDto
    proposalIndex: number
    onSubmit?: (values: ProposalMilestoneFormValues) => void
    isError?: boolean
    isLoading?: boolean
}

export type ProposalMilestoneFormProps = PropsWithChildren<OwnProps>

const ProposalMilestoneForm = ({
    readonly,
    milestone,
    proposalIndex,
    onSubmit,
    onCancel,
    isLoading,
    isError,
}: ProposalMilestoneFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { initialValues, validationSchema, onSubmitFallback } = useProposalMilestoneForm({
        milestone,
    })

    const deleteModal = useModal()

    const submitButtonLabel = milestone
        ? t('proposal.milestones.modal.form.buttons.save')
        : t('proposal.milestones.modal.form.buttons.create')

    return (
        <>
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
                            {isError ? <FormFooterErrorBox error={t('errors.somethingWentWrong')} /> : null}
                            <FormFooterButtonsContainer>
                                <div className={classes.buttonsContainer}>
                                    <FormFooterButton
                                        className={classes.cancelButton}
                                        type={'button'}
                                        variant={'text'}
                                        onClick={onCancel}
                                        disabled={isLoading}
                                    >
                                        {t('proposal.milestones.modal.form.buttons.cancel')}
                                    </FormFooterButton>
                                    {!readonly ? (
                                        <FormFooterButton type={'submit'} variant={'contained'} disabled={isLoading}>
                                            {submitButtonLabel}
                                        </FormFooterButton>
                                    ) : null}
                                </div>
                                {!readonly && milestone ? (
                                    <FormFooterButton
                                        className={classes.removeButton}
                                        type={'button'}
                                        variant={'text'}
                                        onClick={deleteModal.open}
                                        disabled={isLoading}
                                    >
                                        {t('proposal.milestones.modal.form.buttons.remove')}
                                    </FormFooterButton>
                                ) : null}
                            </FormFooterButtonsContainer>
                        </FormFooter>
                    </form>
                )}
            </Formik>
            {milestone ? (
                <DeleteProposalMilestoneModal
                    proposalIndex={proposalIndex}
                    proposalMilestone={milestone}
                    onClose={deleteModal.close}
                    onParentClose={onCancel}
                    open={deleteModal.visible}
                />
            ) : null}
        </>
    )
}

export default ProposalMilestoneForm
