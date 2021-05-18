import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { breakpoints } from '../../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rootBase: {
            paddingTop: '40px',
            display: 'grid',
            gridTemplateAreas: `'a b c'`,
            '&>:nth-child(1)': {
                gridArea: 'a',
            },
            '&>:nth-child(2)': {
                gridArea: 'b',
            },
            '&>:nth-child(3)': {
                gridArea: 'c',
            },
        },
        rootHorizontalToVertical: {
            [theme.breakpoints.down(breakpoints.tablet)]: {
                gridTemplateColumns: '1fr 1fr',
                gridGap: '2em',
                gridTemplateAreas: `
                                     'b b'
                                     'a c'
                                   `,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                gridGap: '0',
                gridTemplateAreas: `
                                     'b b'
                                     'a a'
                                     'c c'
                                   `,
            },
        },
        rootFixedVertical: {
            gridTemplateColumns: '1fr 1fr',
            // gridGap: '15px',
            gridTemplateAreas: `
                                     'b b'
                                     'a c'
                                   `,
        },
        leftButtonWrapper: {
            // display: 'flex',
            // justifyContent: 'flex-start',
        },
        rightButtonWrapper: {
            // display: 'flex',
            // justifyContent: 'flex-end',
        },
    }),
)

interface Props {
    fixedVertical?: boolean
}

export const FormFooter = ({ fixedVertical = false, children }: PropsWithChildren<Props>) => {
    const classes = useStyles()
    return (
        <div
            className={`${classes.rootBase} ${
                fixedVertical ? classes.rootFixedVertical : classes.rootHorizontalToVertical
            }`}
        >
            {children}
        </div>
    )
}
