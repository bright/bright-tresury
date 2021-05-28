import { CardDetails } from '../../../components/card/components/CardDetails'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { Nil } from '../../../util/types'
import Vote, { VoteType } from './Vote'
import { AccountInfo } from '../../proposals.dto'

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

    return (
        <CardDetails>
            <div className={styles.root}>
                {[
                    ...ayes.map((aye: AccountInfo) => (
                        <Vote key={`${VoteType.AYE}_${aye.address}`} accountInfo={aye} voteType={VoteType.AYE} />
                    )),
                    ...nays.map((nay: AccountInfo) => (
                        <Vote key={`${VoteType.NAY}_${nay.address}`} accountInfo={nay} voteType={VoteType.NAY} />
                    )),
                ]}
            </div>
        </CardDetails>
    )
}
export default MotionDetails
