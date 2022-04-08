import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ClassNameProps } from '../../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '20px',
            marginBottom: '6px',
        },
    }),
)

interface OwnProps {}

export type CardDetailsProps = PropsWithChildren<OwnProps> & ClassNameProps

const CardHeader = ({ children, className }: CardDetailsProps) => {
    const classes = useStyles()

    return <div className={clsx(classes.root, className)}>{children}</div>
}

export default CardHeader
