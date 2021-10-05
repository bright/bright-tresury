import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
        },
    }),
)

interface OwnProps {
    description: string
}

export type NotificationsItemDescriptionProps = OwnProps

const NotificationsItemDescription = ({ description }: NotificationsItemDescriptionProps) => {
    const classes = useStyles()
    return <span className={classes.root}>{description}</span>
}

export default NotificationsItemDescription
