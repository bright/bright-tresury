import CardDetails from '../card/components/CardDetails'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { AccountInfo, Nil } from '../../util/types'
import Vote, { VoteType } from './Vote'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '10px 20px',
        },
    }),
)

export interface MotionDetailsProps {
    ayes: Nil<AccountInfo[]>
    nays: Nil<AccountInfo[]>
}

const MotionDetails = ({ ayes, nays }: MotionDetailsProps) => {
    ayes = ayes || []
    nays = nays || []

    const styles = useStyles()

    const renderVote = (accountInfo: AccountInfo, voteType: VoteType) => (
        <Vote key={`${voteType}_${accountInfo.address}`} accountInfo={accountInfo} voteType={voteType} />
    )

    return (
        <CardDetails>
            <div className={styles.root}>
                {ayes.map((aye: AccountInfo) => renderVote(aye, VoteType.AYE))}
                {nays.map((nay: AccountInfo) => renderVote(nay, VoteType.NAY))}
            </div>
        </CardDetails>
    )
}
export default MotionDetails
