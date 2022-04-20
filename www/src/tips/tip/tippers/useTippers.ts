import { ApiPromise } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { ApiState, useSubstrate } from '../../../substrate-lib/api/SubstrateContext'
import { PublicUserDto } from '../../../util/publicUser.dto'
import { Nil } from '../../../util/types'

export interface UseTippersResult {
    tippers: Nil<PublicUserDto[]>
    closingThreshold: Nil<number>
}

const getTippers = async (api: Nil<ApiPromise>, apiState: Nil<ApiState>): Promise<Nil<PublicUserDto[]>> => {
    if (!api || apiState !== ApiState.READY) {
        return
    }
    const tippers = await api.query.council.members()
    return tippers.map((tipper) => ({
        web3address: encodeAddress(tipper.toString()),
    }))
}

export const useTippers = (): UseTippersResult => {
    const { api, apiState } = useSubstrate()
    const { data: tippers } = useQuery(['tippers', api, apiState], () => getTippers(api, apiState))
    const closingThreshold = useMemo(() => (tippers ? Math.floor(tippers.length / 2) + 1 : undefined), [tippers])
    return { tippers, closingThreshold }
}
