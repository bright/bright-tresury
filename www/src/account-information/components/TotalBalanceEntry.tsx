import { styled } from '@material-ui/core'
import BalanceEntry from './BalanceEntry'

const TotalBalanceEntry = styled(BalanceEntry)((props) => ({
    '& > span': {
        color: props.theme.palette.text.primary,
        fontWeight: 'bold',
    },
}))

export default TotalBalanceEntry
