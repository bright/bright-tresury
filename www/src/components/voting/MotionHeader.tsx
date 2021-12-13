import React from 'react'
import CardHeader from '../card/components/CardHeader'
import ayeIcon from '../../assets/aye.svg'
import nayIcon from '../../assets/nay.svg'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { Nil } from '../../util/types'
import { formatNumber } from '../../util/numberUtil'
import { timeToString } from '../../util/dateUtil'
import { BountyMotionMethod, MotionEnd, ProposalMotionMethod } from './MotionDto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0px 16px 8px 16px',
            width: '100%',
        },
        upperRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
        },
        voteCount: {
            margin: '2px',
        },
        lowerRow: {
            fontSize: 12,
            color: theme.palette.text.disabled,
            fontWeight: theme.typography.fontWeightRegular,
        },
        remainingTime: {
            color: theme.palette.text.primary,
        },
        greenAye: {
            color: theme.palette.success.main,
        },
        redNay: {
            color: theme.palette.error.main,
        },
    }),
)

export interface MotionHeaderProps {
    method: ProposalMotionMethod | BountyMotionMethod
    motionEnd: Nil<MotionEnd>
    ayesCount: Nil<number>
    naysCount: Nil<number>
}

const MotionHeader = ({ method, ayesCount, naysCount, motionEnd }: MotionHeaderProps) => {
    const styles = useStyles()
    const { t } = useTranslation()
    const isApprovalMotion = [
        ProposalMotionMethod.Approve,
        BountyMotionMethod.ApproveBounty,
        BountyMotionMethod.ProposeCurator,
    ].includes(method)

    const { endBlock, timeLeft } = motionEnd || {}

    const endBlockStr = endBlock ? `#${formatNumber(endBlock)}` : t('common.na')
    const timeStr = timeLeft ? timeToString(timeLeft, t) : ''

    const getMethodName = (method: ProposalMotionMethod | BountyMotionMethod) => {
        switch (method) {
            case BountyMotionMethod.ApproveBounty:
                return t('bounty.voting.method.approveBounty')
            case BountyMotionMethod.CloseBounty:
                return t('bounty.voting.method.closeBounty')
            case BountyMotionMethod.ProposeCurator:
                return t('bounty.voting.method.proposeCurator')
            case BountyMotionMethod.RejectCurator:
                return t('bounty.voting.method.rejectCurator')
            case ProposalMotionMethod.Approve:
                return t('proposal.voting.motion')
            case ProposalMotionMethod.Reject:
                return t('proposal.voting.motion')
        }
    }

    return (
        <CardHeader>
            <div className={styles.root}>
                <div className={styles.upperRow}>
                    <strong>
                        {getMethodName(method as ProposalMotionMethod | BountyMotionMethod)}{' '}
                        <img src={isApprovalMotion ? ayeIcon : nayIcon} alt={''} />{' '}
                    </strong>
                    <div>
                        <strong className={styles.voteCount}>
                            <span className={styles.greenAye}>Aye</span> ({ayesCount})
                        </strong>
                        <strong className={styles.voteCount}>
                            <span className={styles.redNay}>Nay</span> ({naysCount})
                        </strong>
                    </div>
                </div>
                <div className={styles.lowerRow}>
                    {t('proposal.voting.votingEnd')}
                    <strong className={styles.remainingTime}>
                        {' '}
                        {timeStr} ({endBlockStr})
                    </strong>
                </div>
            </div>
        </CardHeader>
    )
}
export default MotionHeader
