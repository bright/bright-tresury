import React from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import { ActionButtonsProps } from '../../../../../components/header/details/ActionButtons'

interface OwnProps {
    childBounty: ChildBountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const ChildBountyActionButtons = ({ childBounty, ...props }: CuratorActionButtonsProps) => {
    //TODO: Implement when adding accept curator and reject curator
    return null
}

export default ChildBountyActionButtons
