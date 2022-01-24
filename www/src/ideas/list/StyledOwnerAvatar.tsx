import styled from '@material-ui/core/styles/styled'
import { Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'

type PropType = {
    theme: Theme
}

const StyledOwnerAvatar = styled('div')((props: PropType) => ({
    height: '32px',
    lineHeight: '32px',
    width: '32px',
    [props.theme.breakpoints.down(breakpoints.tablet)]: {
        height: '42px',
        lineHeight: '42px',
        width: '42px',
    },
}))

export default StyledOwnerAvatar
