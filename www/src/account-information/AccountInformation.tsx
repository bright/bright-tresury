import AccountInformationIcon from './AccountInformationIcon'
import { Popover } from '@material-ui/core'
import { MouseEvent } from 'react'
import AccountDetails from './AccountDetails'
import { useMenu } from '../hook/useMenu'

interface OwnProps {
    address: string
}
export type IdentityProps = OwnProps

const AccountInformation = ({ address }: IdentityProps) => {
    const { handleOpen, handleClose, anchorEl } = useMenu()

    /*
    event.preventDefault and stopPropagation was added to onClick, onClose and Popover.onClick
    because when AccountInformation is added to the link card (for example ProposalCard)we want to prevent the browser redirecting
     */
    const onClick = (event: MouseEvent<HTMLImageElement>) => {
        event.preventDefault()
        event.stopPropagation()
        handleOpen(event)
    }
    const onClose = (event: MouseEvent) => {
        event.stopPropagation()
        handleClose()
    }
    const visible = Boolean(anchorEl)
    return (
        <>
            <AccountInformationIcon onClick={onClick} />
            <Popover
                open={visible}
                onClose={onClose}
                onClick={(ev) => {
                    ev.stopPropagation()
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <AccountDetails address={address} />
            </Popover>
        </>
    )
}

export default AccountInformation
