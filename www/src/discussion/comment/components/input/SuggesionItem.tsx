import styled from '@material-ui/core/styles/styled'
import User from '../../../../components/user/User'

const SuggestionItem = styled(User)(({ theme }) => ({
    padding: '6px 8px 6px 8px',
    borderTop: 'solid 1px',
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    fontSize: '14px',
}))

export default SuggestionItem
