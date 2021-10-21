import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import {
    BlockchainConfig,
    BlockchainConfigToken,
} from '../blockchain/blockchain-configuration/blockchain-configuration.config'
import { Inject, Injectable } from '@nestjs/common'

export function isValidNetwork(network: string, possibleValues: string[]): boolean {
    return possibleValues.indexOf(network) !== -1
}

@Injectable()
@ValidatorConstraint({ name: 'isValidNetworkConstraint', async: false })
export class IsValidNetworkConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(BlockchainConfigToken) private readonly blockchainConfig: BlockchainConfig[]) {}

    validate(network: string, args: ValidationArguments) {
        return (
            !network ||
            isValidNetwork(
                network,
                this.blockchainConfig.map((config: BlockchainConfig) => config.id),
            )
        )
    }

    defaultMessage(args: ValidationArguments) {
        return 'Network ($value) is invalid'
    }
}
