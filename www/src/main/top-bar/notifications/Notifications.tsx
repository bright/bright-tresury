import { Theme } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import LoadingWrapper from '../../../components/loading/LoadingWrapper'
import { ClassNameProps } from '../../../components/props/className.props'
import { useMenu } from '../../../hook/useMenu'
import { breakpoints } from '../../../theme/theme'
import { useGetUnreadAppEvents } from './app-events.api'
import { AppEventDto, AppEventType } from './app-events.dto'
import BountyDiscussion from './menu-items/BountyDiscussion'
import IdeaDiscussion from './menu-items/IdeaDiscussion'
import ProposalDiscussion from './menu-items/ProposalDiscussion'
import NotificationsButton from './NotificationsButton'
import TipDiscussion from './menu-items/TipDiscussion'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
        },
        header: {
            margin: '24px',
        },
        noNotifications: {
            margin: '24px',
        },
    }),
)

const useMenuStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            backgroundColor: theme.palette.background.default,
            width: '650px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
    }),
)

interface OwnProps {
    userId: string
}

export type NotificationsProps = OwnProps & ClassNameProps

const Notifications = ({ userId, className }: NotificationsProps) => {
    const classes = useStyles()
    const menuClasses = useMenuStyles()
    const { t } = useTranslation()
    const { data, status } = useGetUnreadAppEvents({ userId, pageNumber: 1, pageSize: 10 })

    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const renderComponent = ({ data, id }: AppEventDto) => {
        switch (data.type) {
            case AppEventType.NewIdeaComment:
                return <IdeaDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.TaggedInIdeaComment:
                return <IdeaDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.NewProposalComment:
                return <ProposalDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.TaggedInProposalComment:
                return <ProposalDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.NewBountyComment:
                return <BountyDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.TaggedInBountyComment:
                return <BountyDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.NewTipComment:
                return <TipDiscussion key={id} data={data} closeMenu={handleClose} />
            case AppEventType.TaggedInTipComment:
                return <TipDiscussion key={id} data={data} closeMenu={handleClose} />
            default:
                return null
        }
    }

    return (
        <div className={clsx(classes.root, className)}>
            <NotificationsButton onClick={handleOpen} isOpen={open} hasUnreadNotifications={!!data?.items.length} />
            <Menu
                classes={menuClasses}
                id="simple-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <h3 className={classes.header}>{t('topBar.notifications.notifications')}</h3>
                <LoadingWrapper
                    status={status}
                    errorText={t('topBar.notifications.error')}
                    loadingText={t('topBar.notifications.loading')}
                >
                    {!data || data.items.length === 0 ? (
                        <div className={classes.noNotifications}>{t('topBar.notifications.noNotifications')}</div>
                    ) : (
                        data.items.map(renderComponent)
                    )}
                </LoadingWrapper>
            </Menu>
        </div>
    )
}

export default Notifications
