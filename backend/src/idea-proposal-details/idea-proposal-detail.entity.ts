import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../database/base.entity'

export const ideaProposalDetailRestrictions = {
    field: {
        maxLength: 255,
    },
}

@Entity('idea_proposal_details')
export class IdeaProposalDetail extends BaseEntity {
    @Column({ nullable: false })
    title: string

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

    constructor(title: string, content?: string, field?: string, contact?: string, portfolio?: string, links?: string) {
        super()
        this.title = title
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links
    }
}
