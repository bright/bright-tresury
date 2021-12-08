import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainProposal, BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { PolkassemblyTreasuryProposalPostSchema } from '../schemas/treasury-proposal-post.schema'


export class PolkassemblyTreasuryProposalPostDto {
    title: string
    content: string
    blockchainIndex: number
    proposerAddress: string
    beneficiaryAdress: string
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    status: string
    constructor(post: PolkassemblyTreasuryProposalPostSchema) {
        this.title = post.title
        this.content = post.content
        const [spendProposal] = post.onchain_link.onchain_treasury_spend_proposal
        this.blockchainIndex = spendProposal?.treasuryProposalId
        this.proposerAddress = spendProposal?.proposer
        this.beneficiaryAdress = spendProposal?.beneficiary
        this.value = spendProposal?.value as NetworkPlanckValue
        this.bond = spendProposal?.bond as NetworkPlanckValue
        this.status = spendProposal?.treasuryStatus[0]?.status
    }
    asBlockchainProposal() {
        return new BlockchainProposal(
            this.blockchainIndex,
            {address: this.proposerAddress},
            {address: this.beneficiaryAdress},
            this.value,
            this.bond,
            [],
            this.status as BlockchainProposalStatus
        )
    }
}


