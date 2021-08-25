import styled from '@material-ui/core/styles/styled'
import { breakpoints } from '../../theme/theme'
import StyledFormSelect from './StyledFormSelect'

const StyledSmallFormSelect = styled(StyledFormSelect)(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down(breakpoints.tablet)]: {
        width: '100%',
    },
}))

export default StyledSmallFormSelect
