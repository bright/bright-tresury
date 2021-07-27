import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { IdeaProposalDetails } from '../../idea-proposal-details/idea-proposal-details.entity'
import { IdeaNetwork } from '../../ideas/entities/idea-network.entity'
import { User } from '../../users/user.entity'
import { Nil } from '../../utils/types'

@Entity('proposals')
export class Proposal extends BaseEntity {
    @ManyToOne(() => User)
    owner: Nil<User>

    @Column({ nullable: false, type: 'text' })
    ownerId!: string

    @OneToOne(() => IdeaProposalDetails, { eager: true })
    @JoinColumn()
    details: IdeaProposalDetails

    @OneToOne(() => IdeaNetwork)
    @JoinColumn()
    ideaNetwork: Nil<IdeaNetwork>

    @Column({ nullable: false, type: 'text' })
    ideaNetworkId!: string

    @Column({ nullable: false, type: 'text' })
    networkId: string

    @Column({ nullable: true, type: 'integer' })
    blockchainProposalId: number | null

    constructor(
        owner: User,
        details: IdeaProposalDetails,
        ideaNetwork: IdeaNetwork,
        networkId: string,
        blockchainProposalId: number | null,
    ) {
        super()
        this.networkId = networkId
        this.owner = owner
        this.details = details
        this.ideaNetwork = ideaNetwork
        this.blockchainProposalId = blockchainProposalId
    }
}
