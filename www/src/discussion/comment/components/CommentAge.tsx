import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { extractTime } from '@polkadot/util'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { timeToString } from '../../../util/dateUtil'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        age: {
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
        let time = ''
        if (ageMs < 60 * 1000) {
            time = t('lessThanMinuteAgo')
        } else {
            const extractedTime = { ...extractTime(ageMs), seconds: 0 } // we don't want to show "seconds ago"
            time = timeToString(extractedTime, t)
        }

        return `${title} ${time} ${t('ago')}`
    }, [updatedAt, createdAt, t])

    return <div className={classes.age}>{commentAge}</div>
}
export default CommentAge
