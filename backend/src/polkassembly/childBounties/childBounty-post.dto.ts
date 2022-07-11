import { PolkassemblyChildBountyPostSchema } from './childBounty-post.shema'
import { NetworkPlanckValue } from '../../utils/types'
import { PolkassemblyPostEventDto } from '../dto/polkassembly-post-event.dto'

export class PolkassemblyChildBountyPostDto {
    title: string
    content: string
    blockchainIndex: number
    parentBountyBlockchainIndex
    value: NetworkPlanckValue
    fee: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    curatorAddress: string
    beneficiaryAddress: string
    childBountyStatus: string
    events: PolkassemblyPostEventDto[]

    constructor(post: PolkassemblyChildBountyPostSchema) {
        this.title = post.title
        this.content = post.content
        const [onchainChildBounty] = post.onchain_link.onchain_child_bounty
        this.blockchainIndex = onchainChildBounty?.childBountyId
        this.parentBountyBlockchainIndex = onchainChildBounty?.parentBountyId
        this.value = onchainChildBounty?.value as NetworkPlanckValue
        this.fee = onchainChildBounty?.fee as NetworkPlanckValue
        this.curatorDeposit = onchainChildBounty?.curatorDeposit as NetworkPlanckValue
        this.curatorAddress = onchainChildBounty?.curator
        this.beneficiaryAddress = onchainChildBounty?.beneficiary
        this.childBountyStatus = onchainChildBounty?.childBountyStatus[0]?.status
        this.events = onchainChildBounty?.childBountyStatus?.map(
            (childBountyStatus: any) =>
                new PolkassemblyPostEventDto({
                    eventName: childBountyStatus.status,
                    blockNumber: childBountyStatus.blockNumber.number,
                    blockDateTime: childBountyStatus.blockNumber.startDateTime,
                }),
        )
    }
}
