import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../database/base.entity'

export const ideaProposalDetailsRestrictions = {
    field: {
        maxLength: 255,
    },
}

@Entity('idea_proposal_details')
export class IdeaProposalDetails extends BaseEntity {
    @Column({ nullable: false })
    title!: string

    @Column({ nullable: true, type: 'text' })
    content?: string

    @Column({
        nullable: true,
        type: 'text',
    })
    field?: string

    @Column({ nullable: true, type: 'text' })
    contact?: string

    @Column({ nullable: true, type: 'text' })
    portfolio?: string

    @Column({ nullable: true, type: 'text' })
    links?: string
}
