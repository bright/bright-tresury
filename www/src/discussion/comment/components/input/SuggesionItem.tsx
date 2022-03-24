import styled from '@material-ui/core/styles/styled'
import CommentAuthor from '../CommentAuthor'

const SuggestionItem = styled(CommentAuthor)(({ theme }) => ({
    padding: '16px 28px 16px 28px',
    borderTop: 'solid 1px',
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    fontSize: '14px',
}))

export default SuggestionItem
