export class UserStatisticsDto {
    ideas: number
    proposals: number
    tips: number
    bounties: number

    constructor({
        ideas,
        proposals,
        tips,
        bounties,
    }: {
        ideas: number
        proposals: number
        tips: number
        bounties: number
    }) {
        this.ideas = ideas
        this.proposals = proposals
        this.tips = tips
        this.bounties = bounties
    }
}
