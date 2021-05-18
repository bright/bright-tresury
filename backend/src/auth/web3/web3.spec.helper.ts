import { cleanDatabase } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase } from '../supertokens/specHelpers/supertokens.database.spec.helper'
import { Accessor } from '../../utils/accessor'
import { SignatureValidator } from './signMessage/signature.validator'
import { INestApplication } from '@nestjs/common'

export async function beforeEachWeb3E2eTest(accessor: Accessor<INestApplication>): Promise<void> {
    /**
     * Mock signature validation so that we don't use real blockchain for signing.
     */
    jest.spyOn(accessor.get().get(SignatureValidator), 'validateSignature').mockImplementation((): boolean => true)
    await cleanDatabases()
}

export async function cleanDatabases() {
    await cleanDatabase()
    await cleanAuthorizationDatabase()
}
