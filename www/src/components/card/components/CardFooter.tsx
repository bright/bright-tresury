import { styled } from '@material-ui/core'
import { breakpoints } from '../../../theme/theme'

const CardFooter = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    [theme.breakpoints.down(breakpoints.mobile)]: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
}))
export default CardFooter
