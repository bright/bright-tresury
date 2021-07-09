export class GetProposalsCountDto {
    submitted: number
    approved: number
    rejected: number

    constructor(submitted: number, approved: number, rejected: number) {
        this.submitted = submitted
        this.approved = approved
        this.rejected = rejected
    }
}