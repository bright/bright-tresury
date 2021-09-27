import React, { useMemo } from 'react'
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
    const commentAge = useMemo(() => {
        const title =
            updatedAt > createdAt
                ? t('discussion.commentUpdatedTimestampTitle')
                : t('discussion.commentCreatedTimestampTitle')

        const timestamp = updatedAt > createdAt ? updatedAt : createdAt
        const ageMs = Date.now() - timestamp
        if (ageMs < 60 * 1000) return t('lessThanMinuteAgo')
        const extractedTime = { ...extractTime(ageMs), seconds: 0 } // we don't want to show "seconds ago"

        return `${title} ${timeToString(extractedTime, t)} ${t('ago')}`
    }, [updatedAt, createdAt, t])

    return <div className={classes.age}>{commentAge}</div>
}
export default CommentAge
