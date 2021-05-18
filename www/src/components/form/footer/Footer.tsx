import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rootBase: {
            paddingTop: '40px',
            display: 'grid',
            gridTemplateAreas: `'leftButton errorMessage rightButton'`,
            '&>:nth-child(1)': {
                gridArea: 'leftButton',
            },
            '&>:nth-child(2)': {
                gridArea: 'errorMessage',
            },
            '&>:nth-child(3)': {
                gridArea: 'rightButton',
            },
        },
        rootHorizontalToVerticalLayout: {
            [theme.breakpoints.down(breakpoints.tablet)]: {
                gridGap: '2em',
                gridTemplateAreas: `
                                     'errorMessage errorMessage'
                                     'leftButton rightButton'
                                   `,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                gridTemplateAreas: `
                                     'errorMessage errorMessage'
                                     'rightButton rightButton'
                                     'leftButton leftButton'
                                   `,
            },
        },
        rootFixedVerticalLayout: {
            gridTemplateColumns: '1fr 1fr',
            gridGap: '2em',
            gridTemplateAreas: `
                                     'errorMessage errorMessage'
                                     'leftButton rightButton'
                                   `,
        },
    }),
)

interface Props {
    fixedVerticalLayout?: boolean
}

export const Footer = ({ fixedVerticalLayout = false, children }: PropsWithChildren<Props>) => {
    const classes = useStyles()
    return (
        <div
            className={`${classes.rootBase} ${
                fixedVerticalLayout ? classes.rootFixedVerticalLayout : classes.rootHorizontalToVerticalLayout
            }`}
        >
            {children}
        </div>
    )
}
