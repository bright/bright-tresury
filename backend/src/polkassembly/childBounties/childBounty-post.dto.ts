import { PolkassemblyChildBountyPostSchema } from './childBounty-post.shema'
import { NetworkPlanckValue } from '../../utils/types'
import { PolkassemblyPostEventDto } from '../dto/polkassembly-post-event.dto'
import {
    BlockchainChildBountyDto,
    BlockchainChildBountyStatus,
} from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'

export class PolkassemblyChildBountyPostDto {
    title: string
    content: string
    blockchainIndex: number
    parentBountyBlockchainIndex
    value: NetworkPlanckValue
    fee: NetworkPlanckValue
    description: string
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
        this.description = onchainChildBounty?.description
        this.value = onchainChildBounty?.value as NetworkPlanckValue
        this.fee = onchainChildBounty?.fee as NetworkPlanckValue
        this.curatorDeposit = onchainChildBounty?.curatorDeposit as NetworkPlanckValue
        this.curatorAddress = onchainChildBounty?.curator
        this.beneficiaryAddress = onchainChildBounty?.beneficiary
        this.events = onchainChildBounty?.childBountyStatus
            ?.map(
                (childBountyStatus: any) =>
                    new PolkassemblyPostEventDto({
                        eventName: childBountyStatus.status,
                        blockNumber: childBountyStatus.blockNumber.number,
                        blockDateTime: childBountyStatus.blockNumber.startDateTime,
                    }),
            )
            .sort((a, b) => b.blockNumber - a.blockNumber)
        this.childBountyStatus = this.events[0].eventName
    }

    asBlockchainChildBountyDto(): BlockchainChildBountyDto {
        const toBlockchainChildBountyStatus = (eventName: string) => {
            switch (eventName) {
                case 'Added':
                    return BlockchainChildBountyStatus.Added
                case 'CuratorProposed':
                    return BlockchainChildBountyStatus.CuratorProposed
                case 'Active':
                    return BlockchainChildBountyStatus.Active
                case 'PendingPayout':
                    return BlockchainChildBountyStatus.PendingPayout
                case 'Awarded':
                    return BlockchainChildBountyStatus.Awarded
                case 'Claimed':
                    return BlockchainChildBountyStatus.Claimed
                case 'Canceled':
                    return BlockchainChildBountyStatus.Canceled
                default:
                    return BlockchainChildBountyStatus.Unknown
            }
        }

        return new BlockchainChildBountyDto({
            index: this.blockchainIndex,
            parentIndex: this.parentBountyBlockchainIndex,
            description: this.description,
            value: this.value,
            fee: this.fee,
            curator: this.curatorAddress,
            curatorDeposit: this.curatorDeposit,
            beneficiary: this.beneficiaryAddress,
            unlockAt: null,
            status: toBlockchainChildBountyStatus(this.childBountyStatus),
        })
    }
}
