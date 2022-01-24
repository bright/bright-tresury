import styled from '@material-ui/core/styles/styled'
import { Theme } from '@material-ui/core/styles'
import { breakpoints, theme } from '../../../theme/theme'

type PropType = {
    theme: Theme
}

const StyledAvatar = styled('div')((props: PropType) => ({
    height: '32px',
    lineHeight: '32px',
    width: '32px',
    borderRadius: '6px',
    fontSize: '18px',
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    [props.theme.breakpoints.down(breakpoints.tablet)]: {
        height: '42px',
        lineHeight: '42px',
        width: '42px',
    },
}))

export default StyledAvatar
