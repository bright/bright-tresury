import { PolkassemblyPostDto, PolkassemblyPostType } from '../../../../../polkassembly/api/polkassembly-posts.dto'
import { BountyDto } from '../../../../bounties.dto'

export interface UseBountyPolkassemblyShareResult {
    postData: PolkassemblyPostDto
}

interface OwnProps {
    bounty: BountyDto
}

export type UseBountyPolkassemblyShareProps = OwnProps

export const useBountyPolkassemblyShare = ({
    bounty,
}: UseBountyPolkassemblyShareProps): UseBountyPolkassemblyShareResult => {
    // TODO return formatted content and title in TREAS-368
    return {
        postData: {
            title: 'Title',
            content: 'Description',
            onChainIndex: bounty.blockchainIndex,
            type: PolkassemblyPostType.Bounty,
        },
    }
}
