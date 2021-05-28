import { AddressInfoWithLabel } from '../../../components/identicon/AddressInfoWithLabel'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { AccountInfo } from '../../proposals.dto'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        vote: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItem: 'center',
        },
    }),
)

export enum VoteType {
    AYE = 'Aye',
    NAY = 'Nay',
}

interface VoteProps {
    accountInfo: AccountInfo
    voteType: VoteType
}

const Vote = ({ accountInfo, voteType }: VoteProps) => {
    const styles = useStyles()
    return (
        <div className={styles.vote}>
            <AddressInfoWithLabel
                address={accountInfo.address}
                label={accountInfo.display || ''}
            ></AddressInfoWithLabel>
            <span style={{}}>{voteType}</span>
        </div>
    )
}
export default Vote
