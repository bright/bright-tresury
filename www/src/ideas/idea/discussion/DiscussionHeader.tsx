import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import CopyInputValue from './CopyInputValue'
import { useAuth } from '../../../auth/AuthContext'
import PleaseLogIn from './PleaseLogIn'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        topRow: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
    }),
)
interface OwnProps {}
export type DiscussionTopRowProps = OwnProps

const DiscussionHeader = ({}: DiscussionTopRowProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isUserSignedInAndVerified: canComment } = useAuth()
    return (
        <div className={classes.topRow}>
            <CopyInputValue value={window.location.href} copyText={t('idea.copyLink')} />
            {!canComment ? <PleaseLogIn /> : null}
        </div>
    )
}

export default DiscussionHeader
