import { ApiProperty } from '@nestjs/swagger'
import { MotionTimeDto } from '../../blockchain/dto/motion-time.dto'
import { MotionDto, MotionStatus } from '../../blockchain/dto/motion.dto'
import { getLogger } from '../../logging.module'
import { MotionSchema } from '../schemas/motion.schema'
import BN from 'bn.js'

export class ExecutedMotionDto extends MotionDto {
    @ApiProperty({ description: 'Status of the motion', type: MotionStatus })
    status: MotionStatus

    constructor(schema: MotionSchema, toMotionTime: (pastBlock: BN) => MotionTimeDto) {
        getLogger().info(schema)
        super()
        this.hash = schema.motionProposalHash
        this.method = schema.method
        this.motionIndex = schema.motionProposalId
        const isApproved = schema.motionStatus.find((status) => status.status === 'Approved')
        const isDisapproved = schema.motionStatus.find((status) => status.status === 'Disapproved')
        this.status = isApproved
            ? MotionStatus.Approved
            : isDisapproved
            ? MotionStatus.Disapproved
            : MotionStatus.Proposed
        const executed = schema.motionStatus.find((status) => status.status === 'Executed')
        if (executed) {
            this.motionEnd = toMotionTime(new BN(executed.blockNumber.number))
        }
        const proposed = schema.motionStatus.find((status) => status.status === 'Proposed')
        if (proposed) {
            this.motionStart = toMotionTime(new BN(proposed.blockNumber.number))
        }
    }
}
