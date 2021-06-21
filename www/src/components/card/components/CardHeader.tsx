import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

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

export type CardDetailsProps = PropsWithChildren<OwnProps>

const CardHeader = ({ children }: CardDetailsProps) => {
    const classes = useStyles()

    return <div className={classes.root}>{children}</div>
}

export default CardHeader
