import styled from '@material-ui/core/styles/styled'

import { breakpoints } from '../../theme/theme'
import { Theme } from '@material-ui/core/styles'

type PropType = {
    theme: Theme
}

const StyledSpacer = styled('div')((props: PropType) => ({
    height: '2px',
    backgroundColor: props.theme.palette.background.default,
    marginTop: '32px',
    marginBottom: '32px',

    width: '50%',
    [props.theme.breakpoints.down(breakpoints.tablet)]: {
        width: '75%',
    },
    [props.theme.breakpoints.down(breakpoints.mobile)]: {
        paddingLeft: '1em',
        paddingRight: '1em',
        width: '100%',
    },
}))

export default StyledSpacer
