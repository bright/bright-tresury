import { ChildBountyDto } from '../../child-bounties.dto'
import MenuItem from '../../../../../main/top-bar/account/MenuItem'
import { BountyDto } from '../../../../bounties.dto'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useChildBounty } from '../../useChildBounty'
import { useModal } from '../../../../../components/modal/useModal'
import { generatePath } from 'react-router'
import { ROUTE_CHILD_BOUNTIES } from '../../../../../routes/routes'
import CloseChildBountyModal from './CloseChildBountyModal'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}
export type CloseChildBountyMenuItemProps = OwnProps
const CloseChildBountyMenuItem = ({ childBounty, bounty }: CloseChildBountyMenuItemProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { open, visible, close } = useModal()
    const { canCloseChildBounty } = useChildBounty(bounty, childBounty)
    const onSuccess = () => {
        history.push(generatePath(ROUTE_CHILD_BOUNTIES, { bountyIndex: bounty.blockchainIndex }))
        close()
    }
    return (
        <>
            <MenuItem key={'CloseChildBounty'} onClick={open} disabled={!canCloseChildBounty}>
                {t('childBounty.header.closeChildBounty')}
            </MenuItem>
            <CloseChildBountyModal open={visible} onClose={close} onSuccess={onSuccess} childBounty={childBounty} />
        </>
    )
}

export default CloseChildBountyMenuItem
