import { NetworkPlanckValue } from '../../utils/types'
import { BlockchainProposal, BlockchainProposalStatus } from '../../blockchain/dto/blockchain-proposal.dto'
import { PolkassemblyTreasuryProposalPostSchema } from './treasury-proposal-post.schema'

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
        // Note: seems like all polkassembly proposals have status 'Proposed',
        // since we don't want to show all Proposed I am setting the status to Unknown to don't show it at all
        // https://github.com/Premiurly/polkassembly/blob/9139de85d81a77d12b64799960069f50b0df687a/node-watcher/src/tasks/createTreasury.ts#L95
        return new BlockchainProposal(
            this.blockchainIndex,
            { address: this.proposerAddress },
            { address: this.beneficiaryAdress },
            this.value,
            this.bond,
            [],
            BlockchainProposalStatus.Unknown,
        )
    }
}
