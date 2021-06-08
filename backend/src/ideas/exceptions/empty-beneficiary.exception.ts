import { BadRequestException } from '@nestjs/common'

export class EmptyBeneficiaryException extends BadRequestException {
    constructor() {
        super(`Beneficiary can't be empty`)
    }
}
