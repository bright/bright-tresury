import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            flexDirection: 'row-reverse',
            flexGrow: 1,
            alignItems: 'flex-end',
            width: '100%',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                gap: '1em',
                justifyContent: 'inherit',
                flexDirection: 'column',
            },
        },
    }),
)

interface OwnProps {}

export type FormFooterButtonsContainerProps = PropsWithChildren<OwnProps>

const FormFooterButtonsContainer = ({ children }: FormFooterButtonsContainerProps) => {
    const classes = useStyles()

    return <div className={classes.root}>{children}</div>
}

export default FormFooterButtonsContainer
