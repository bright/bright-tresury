import styled from '@material-ui/core/styles/styled'
import { theme } from '../../theme/theme'

const ContentContainer = styled('div')(() => ({
    display: 'flex',
    height: '155px',
    background: theme.palette.background.default,
    borderRadius: '10px',
}))

export default ContentContainer
