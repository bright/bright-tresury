import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import User from '../../../user/User'
import { PublicUserDto } from '../../../../util/publicUser.dto'

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
    user: PublicUserDto
    voteType: VoteType
}

export type VoteProps = OwnProps

const Vote = ({ user, voteType }: VoteProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const colorClassName = voteType === VoteType.Aye ? classes.green : classes.red
    const label = voteType === VoteType.Aye ? t('voting.vote.aye') : t('voting.vote.nay')
    return (
        <div className={classes.vote}>
            <User user={user} />
            <strong className={clsx(classes.voteType, colorClassName)}>{label}</strong>
        </div>
    )
}
export default Vote
