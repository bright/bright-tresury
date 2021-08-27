import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../../components/button/Button'
import InformationTip from '../../../../components/info/InformationTip'
import { ProposalDto } from '../../../proposals.dto'
import { usePostProposalDetails } from '../proposal-details.api'
import ProposalDetailsForm from './ProposalDetailsForm'

const useStyles = makeStyles(() =>
    createStyles({
        spacer: {
            marginTop: '2em',
        },
        smallSpacer: {
            marginTop: '1em',
        },
    }),
)

const INITIAL_DETAILS = { title: '', field: '', content: '', contact: '', portfolio: '', links: [] }

interface OwnProps {
    proposal: ProposalDto
}

export type AddProposalDetailsProps = OwnProps

const AddProposalDetails = ({ proposal: { proposalIndex } }: AddProposalDetailsProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const [isFormVisible, setIsFormVisible] = useState(false)

    const showForm = () => setIsFormVisible(true)
    const hideForm = () => setIsFormVisible(false)

    return (
        <>
            <InformationTip className={classes.spacer} label={t('proposal.details.noProposalDetails.canAdd')} />
            {isFormVisible ? (
                <>
                    <Button className={classes.smallSpacer} variant="text" color="primary" onClick={hideForm}>
                        {t('proposal.details.noProposalDetails.hideDetails')}
                    </Button>
                    <ProposalDetailsForm
                        useMutation={usePostProposalDetails}
                        details={INITIAL_DETAILS}
                        proposalIndex={proposalIndex}
                    />
                </>
            ) : (
                <Button className={classes.smallSpacer} variant="text" color="primary" onClick={showForm}>
                    {t('proposal.details.noProposalDetails.addDetails')}
                </Button>
            )}
        </>
    )
}
export default AddProposalDetails
