import styled from '@material-ui/core/styles/styled'
import User from '../../../../components/user/User'

const SuggestionItem = styled(User)(({ theme }) => ({
    padding: '12px 24px 8px 20px',
    margin: '0',
    borderTop: 'solid 1px',
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    fontSize: '14px',
}))

export default SuggestionItem
