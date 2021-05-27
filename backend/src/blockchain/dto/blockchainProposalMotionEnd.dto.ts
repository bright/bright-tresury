import {Time} from "@polkadot/util/types";

export interface BlockchainProposalMotionEnd {
    endBlock: number,
    remainingBlocks: number,
    timeLeft: Time
}
