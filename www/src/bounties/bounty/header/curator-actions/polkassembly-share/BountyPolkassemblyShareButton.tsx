import React from 'react'
import PolkassemblyShareButton from '../../../../../polkassembly/PolkassemblyShareButton'
import { BountyDto } from '../../../../bounties.dto'
import { useBountyPolkassemblyShare } from './useBountyPolkassemblyShare'

interface OwnProps {
    bounty: BountyDto
}

export type BountyPolkassemblyShareButtonProps = OwnProps

const BountyPolkassemblyShareButton = ({ bounty }: BountyPolkassemblyShareButtonProps) => {
    const { postData } = useBountyPolkassemblyShare({ bounty })

    return (
        <PolkassemblyShareButton
            web3address={bounty.proposer.web3address!}
            postData={postData}
            disabled={!bounty.title}
        />
    )
}

export default BountyPolkassemblyShareButton
