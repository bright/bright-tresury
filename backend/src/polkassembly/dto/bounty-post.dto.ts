import { NetworkPlanckValue } from '../../utils/types'
import { PolkassemblyPostEventDto } from './polkassembly-post-event.dto'
import {
    BlockchainBountyDto,
    BlockchainBountyStatus,
} from '../../blockchain/blockchain-bounties/dto/blockchain-bounty.dto'
import { PolkassemblyBountyPostSchema } from '../schemas/bounty-post.schema'


export class PolkassemblyBountyPostDto {
    title: string
    content: string
    blockchainIndex: number
    proposerAddress: string
    value: NetworkPlanckValue
    fee: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    bond: NetworkPlanckValue
    curatorAddress: string
    beneficiaryAddress: string
    bountyStatus: string
    events: PolkassemblyPostEventDto[]

    constructor(post: PolkassemblyBountyPostSchema) {
        this.title = post.title
        this.content = post.content
        const [onchainBounty] = post.onchain_link.onchain_bounty
        this.blockchainIndex = onchainBounty?.bountyId
        this.proposerAddress = onchainBounty?.proposer
        this.value = onchainBounty?.value as NetworkPlanckValue
        this.fee = onchainBounty?.fee as NetworkPlanckValue
        this.curatorDeposit = onchainBounty?.curatorDeposit as NetworkPlanckValue
        this.bond = onchainBounty?.bond as NetworkPlanckValue
        this.curatorAddress = onchainBounty?.curator
        this.beneficiaryAddress = onchainBounty?.beneficiary
        this.bountyStatus = onchainBounty?.bountyStatus[0]?.status
        this.events = onchainBounty?.bountyStatus?.map((bountyStatus: any) =>
            new PolkassemblyPostEventDto({
                eventName: bountyStatus.status,
                blockNumber: bountyStatus.blockNumber.number,
                blockDateTime: bountyStatus.blockNumber.startDateTime,
            }))
    }
    asBlockchainBountyDto() {
        return new BlockchainBountyDto({
            index: this.blockchainIndex,
            description: '',
            proposer: {address: this.proposerAddress},
            value: this.value,
            bond: this.bond,
            curatorDeposit: this.curatorDeposit,
            curator: {address: this.curatorAddress},
            beneficiary: {address: this.beneficiaryAddress},
            fee: this.fee,
            status: this.bountyStatus as BlockchainBountyStatus
        })
    }
}
