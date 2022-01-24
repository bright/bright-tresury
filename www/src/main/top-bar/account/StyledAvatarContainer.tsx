import styled from '@material-ui/core/styles/styled'
import { Theme } from '@material-ui/core/styles'

type PropType = {
    theme: Theme
}

const StyledAvatarContainer = styled('div')((props: PropType) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    lineHeight: '30px',
    width: '30px',
    borderRadius: '8px',
    backgroundColor: '#eeeeee',
}))

export default StyledAvatarContainer
