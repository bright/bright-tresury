import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { timeToString } from '../../../util/dateUtil'
import { extractTime } from '@polkadot/util'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        age: {
            paddingTop: '6px',
            color: theme.palette.text.disabled,
        },
    }),
)

interface OwnProps {
    createdAt: number
    updatedAt: number
}
export type CommentAgeProps = OwnProps
const CommentAge = ({ createdAt, updatedAt }: CommentAgeProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const formatAge = (timestamp: number) => {
        const ageMs = Date.now() - timestamp
        if (ageMs < 60 * 1000) return t('lessThanMinuteAgo')
        const extractedTime = { ...extractTime(ageMs), seconds: 0 } // we don't want to show "seconds ago"
        return `${timeToString(extractedTime, t)} ${t('ago')}`
    }
    const text =
        updatedAt > createdAt
            ? t('discussion.commentUpdatedTimestampTitle')
            : t('discussion.commentCreateTimestampTitle')
    const timestamp = updatedAt > createdAt ? updatedAt : createdAt

    return (
        <div className={classes.age}>
            {text} {formatAge(timestamp)}
        </div>
    )
}
export default CommentAge
