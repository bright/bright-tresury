import { MotionMethod } from '../../blockchain/dto/motion.dto'

export interface MotionSchema {
    motionProposalId: number
    motionProposalHash: string
    method: MotionMethod
    section: MotionSection
    memberCount: 12
    motionProposalArguments: MotionProposalArgumentSchema[]
    motionStatus: MotionStatusSchema[]
}

export interface MotionProposalArgumentSchema {
    name: string
    value: string
}

export interface MotionStatusSchema {
    blockNumber: { number: string }
    status: 'Proposed' | 'Closed' | 'Approved' | 'Executed' | 'Disapproved'
}

export type MotionSection = 'treasury' | 'bounties'
