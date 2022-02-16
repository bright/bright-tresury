import React, { useMemo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { timeToString } from '../../../util/dateUtil'
import { extractTime } from '@polkadot/util'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        age: {
            paddingTop: '6px',
            color: theme.palette.text.disabled,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                paddingTop: '12px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingTop: '6px',
            },
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
