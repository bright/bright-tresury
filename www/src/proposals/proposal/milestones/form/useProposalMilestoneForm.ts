import useMilestoneDetailsForm from '../../../../milestone-details/useMilestoneDetailsForm'
import { ProposalMilestoneDto } from '../proposal.milestones.dto'

interface OwnProps {
    milestone?: ProposalMilestoneDto
}

export type useProposalMilestoneForm = OwnProps

const useProposalMilestoneForm = ({ milestone }: useProposalMilestoneForm) => {
    const { validationSchema: detailsValidationSchema, initialValues: detailsInitialValues } = useMilestoneDetailsForm({
        details: milestone?.details,
    })

    const onSubmitFallback = () => {}

    return {
        initialValues: detailsInitialValues,
        validationSchema: detailsValidationSchema,
        onSubmitFallback,
    }
}

export default useProposalMilestoneForm
