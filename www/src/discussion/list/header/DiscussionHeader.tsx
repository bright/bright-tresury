import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../auth/AuthContext'
import { Nil } from '../../../util/types'
import PleaseLogIn from '../PleaseLogIn'
import CopyInputValue from './CopyInputValue'
import DiscussionInfoBox from './DiscussionInfoBox'

const useStyles = makeStyles(() =>
    createStyles({
        topRow: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
    }),
)

interface OwnProps {
    info?: Nil<React.ReactNode>
}

export type DiscussionHeaderProps = OwnProps

const DiscussionHeader = ({ info }: DiscussionHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isUserSignedInAndVerified: canComment } = useAuth()
    return (
        <div className={classes.topRow}>
            {info ? <DiscussionInfoBox>{info}</DiscussionInfoBox> : null}
            <CopyInputValue value={window.location.href} copyText={t('idea.copyLink')} />
            {!canComment ? <PleaseLogIn /> : null}
        </div>
    )
}

export default DiscussionHeader
