import CardDetails from '../../../card/components/CardDetails'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { Nil } from '../../../../util/types'
import Vote, { VoteType } from './Vote'
import { PublicUserDto } from '../../../../util/publicUser.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '10px 20px',
        },
    }),
)

interface OwnProps {
    ayes: Nil<PublicUserDto[]>
    nays: Nil<PublicUserDto[]>
}

export type MotionDetailsProps = OwnProps

const MotionDetails = ({ ayes, nays }: MotionDetailsProps) => {
    ayes = ayes || []
    nays = nays || []

    const styles = useStyles()

    const renderVote = (user: PublicUserDto, voteType: VoteType) => (
        <Vote key={`${voteType}_${user.web3address}`} user={user} voteType={voteType} />
    )

    return (
        <CardDetails>
            <div className={styles.root}>
                {ayes.map((aye: PublicUserDto) => renderVote(aye, VoteType.Aye))}
                {nays.map((nay: PublicUserDto) => renderVote(nay, VoteType.Nay))}
            </div>
        </CardDetails>
    )
}
export default MotionDetails
