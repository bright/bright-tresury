import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { breakpoints } from '../../../../../theme/theme'

export const useIdeaMilestoneFormFooterStyles = makeStyles((theme: Theme) =>
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
            gridTemplateColumns: '100% 1fr 100px',
            gridGap: '15px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                gridTemplateColumns: '1fr 1fr',
                gridGap: '0px',
                gridTemplateAreas: `
                                     'b b'
                                     'a c'
                                   `,
            },
        },
        rootFixedVertical: {
            gridTemplateColumns: '1fr 1fr',
            gridGap: '15px',
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
