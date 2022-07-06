import React from 'react'
import PolkassemblyShareButton from '../../../../../../../polkassembly/PolkassemblyShareButton'
import { BountyDto, BountyStatus } from '../../../../../../bounties.dto'
import { ChildBountyDto } from '../../../../child-bounties.dto'
import { useChildBountyPolkassemblyShare } from './useChildBountyPolkassemblyShare'
import { useAuth } from '../../../../../../../auth/AuthContext'
import { useChildBounty } from '../../../../useChildBounty'

interface OwnProps {
    bounty: BountyDto
    childBounty: ChildBountyDto
}

export type ChildBountyPolkassemblyShareButtonProps = OwnProps

const ChildBountyPolkassemblyShareButton = ({ bounty, childBounty }: ChildBountyPolkassemblyShareButtonProps) => {
    const { postData } = useChildBountyPolkassemblyShare({ childBounty })
    const { isCurator, curator, isProposer, proposer } = useChildBounty(bounty, childBounty)
    const web3address = isProposer ? proposer : isCurator ? curator : null
    if (!web3address) return null
    return <PolkassemblyShareButton web3address={web3address} postData={postData} disabled={!childBounty.title} />
}

export default ChildBountyPolkassemblyShareButton
