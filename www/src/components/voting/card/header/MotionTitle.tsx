import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ayeIcon from '../../../../assets/aye.svg'
import nayIcon from '../../../../assets/nay.svg'
import { BountyMotionMethod, MotionMethod, ProposalMotionMethod } from '../../motion.dto'

export interface OwnProps {
    method: MotionMethod
}

export type MotionTitleProps = OwnProps

const MotionTitle = ({ method }: MotionTitleProps) => {
    const { t } = useTranslation()
    const isApprovalMotion = [
        ProposalMotionMethod.Approve,
        BountyMotionMethod.ApproveBounty,
        BountyMotionMethod.ProposeCurator,
    ].includes(method)

    const methodName = useMemo(() => {
        switch (method) {
            case BountyMotionMethod.ApproveBounty:
                return t('voting.method.approveBounty')
            case BountyMotionMethod.CloseBounty:
                return t('voting.method.closeBounty')
            case BountyMotionMethod.ProposeCurator:
                return t('voting.method.proposeCurator')
            case BountyMotionMethod.RejectCurator:
                return t('voting.method.rejectCurator')
            case ProposalMotionMethod.Approve:
                return t('voting.motion')
            case ProposalMotionMethod.Reject:
                return t('voting.motion')
        }
    }, [method, t])

    return (
        <strong>
            {methodName} <img src={isApprovalMotion ? ayeIcon : nayIcon} alt={''} />{' '}
        </strong>
    )
}
export default MotionTitle
