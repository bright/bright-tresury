import styled from '@material-ui/core/styles/styled'
import { theme } from '../../theme/theme'

const ContentContainer = styled('div')(() => ({
    display: 'flex',
    height: '165px',
    background: theme.palette.background.default,
    borderRadius: '10px',
    opacity: '1',
}))

export default ContentContainer
