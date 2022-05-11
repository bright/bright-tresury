import React from 'react'
import PolkassemblyShareButton from '../../../polkassembly/PolkassemblyShareButton'
import { TipDto } from '../../tips.dto'
import { useTipPolkassemblyShare } from './useTipPolkassemblyShare'

interface OwnProps {
    tip: TipDto
}

export type BountyPolkassemblyShareButtonProps = OwnProps

const TipPolkassemblyShareButton = ({ tip }: BountyPolkassemblyShareButtonProps) => {
    const { postData } = useTipPolkassemblyShare({ tip })

    return <PolkassemblyShareButton web3address={tip.finder.web3address!} postData={postData} disabled={false} />
}

export default TipPolkassemblyShareButton
