import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) =>
    createStyles({
        header: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        icon: { height: '28px', marginRight: '12px' },
        title: {
            margin: '0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme.palette.text.disabled,
        },
        goTo: {
            flexGrow: 1,
            color: theme.palette.primary.main,
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'end',
        },
    }),
)

interface OwnProps {
    iconSvg: string
    title: string
    goTo: string
}

export type NotificationsMenuItemHeaderProps = OwnProps

const NotificationsMenuItemHeader = ({ iconSvg, title, goTo }: NotificationsMenuItemHeaderProps) => {
    const classes = useStyles()
    return (
        <div className={classes.header}>
            <img className={classes.icon} src={iconSvg} alt={title} />
            <span className={classes.title}>{title}</span>
            <span className={classes.goTo}>{goTo}</span>
        </div>
    )
}

export default NotificationsMenuItemHeader
