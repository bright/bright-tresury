import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '0',
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column-reverse',
                alignItems: 'flex-start',
            },
        },
    }),
)

interface OwnProps {}

export type CardDetailsProps = PropsWithChildren<OwnProps>

const CardDetails = ({ children }: CardDetailsProps) => {
    const classes = useStyles()

    return <div className={classes.root}>{children}</div>
}
export default CardDetails
