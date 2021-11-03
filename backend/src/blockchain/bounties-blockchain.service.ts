import { Injectable } from '@nestjs/common'
import { ExtrinsicEvent } from '../extrinsics/extrinsicEvent'
import { getLogger } from '../logging.module'
import { extractNumberFromBlockchainEvent } from './utils'

const logger = getLogger()

@Injectable()
export class BountiesBlockchainService {
    static extractBountyIndex(extrinsicEvents: ExtrinsicEvent[]): number | undefined {
        logger.info('Looking for a bounty proposal index')
        return extractNumberFromBlockchainEvent(extrinsicEvents, 'bounties', 'BountyProposed', 'BountyIndex')
    }
}
