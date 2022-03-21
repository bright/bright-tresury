import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { AccountInfo } from '../../../../util/types'
import User from '../../../user/User'

const useStyles = makeStyles((theme) =>
    createStyles({
        vote: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItem: 'center',
        },
        voteType: {
            marginTop: '24px',
        },
        green: {
            color: theme.palette.success.main,
        },
        red: {
            color: theme.palette.error.main,
        },
    }),
)

export enum VoteType {
    Aye = 'Aye',
    Nay = 'Nay',
}

interface OwnProps {
    accountInfo: AccountInfo
    voteType: VoteType
}

export type VoteProps = OwnProps

const Vote = ({ accountInfo, voteType }: VoteProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const colorClassName = voteType === VoteType.Aye ? classes.green : classes.red
    const label = voteType === VoteType.Aye ? t('voting.vote.aye') : t('voting.vote.nay')
    return (
        <div className={classes.vote}>
            <User user={{ web3address: accountInfo.address }} />
            <strong className={clsx(classes.voteType, colorClassName)}>{label}</strong>
        </div>
    )
}
export default Vote
