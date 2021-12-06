import AddressInfoWithLabel from '../identicon/AddressInfoWithLabel'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { AccountInfo } from '../../util/types'

const useStyles = makeStyles(() =>
    createStyles({
        vote: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItem: 'center',
        },
        voteType: {
            marginTop: '24px',
        },
    }),
)

export enum VoteType {
    AYE = 'Aye',
    NAY = 'Nay',
}

export interface VoteProps {
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
            <span className={styles.voteType}>{voteType}</span>
        </div>
    )
}
export default Vote
