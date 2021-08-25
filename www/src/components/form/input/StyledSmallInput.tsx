import styled from '@material-ui/core/styles/styled'
import { breakpoints } from '../../../theme/theme'
import StyledInput from './StyledInput'

const StyledSmallInput = styled(StyledInput)(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down(breakpoints.tablet)]: {
        width: '100%',
    },
}))

export default StyledSmallInput
