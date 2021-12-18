import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccountInfo } from '../../../../util/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        green: {
            color: theme.palette.success.main,
        },
        red: {
            marginLeft: '1em',
            color: theme.palette.error.main,
        },
    }),
)

interface OwnProps {
    ayes: AccountInfo[]
    nays: AccountInfo[]
}

export type VoteCountProps = OwnProps

const VoteCount = ({ ayes, nays }: VoteCountProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <>
            <strong>
                <span className={classes.green}>{t('voting.vote.aye')}</span> ({ayes.length})
            </strong>
            <strong>
                <span className={classes.red}>{t('voting.vote.nay')}</span> ({nays.length})
            </strong>
        </>
    )
}
export default VoteCount
