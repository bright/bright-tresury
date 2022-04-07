import { encodeAddress } from '@polkadot/util-crypto'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { MentionProps, SuggestionDataItem } from 'react-mentions'
import { useNetworks } from '../../../../networks/useNetworks'
import { useSubstrate } from '../../../../substrate-lib/api/SubstrateContext'
import { PublicInAppUserDto } from '../../../../util/publicUser.dto'
import { getIdentity } from '../../../../util/useIdentity'

import SuggestionItem from './SuggesionItem'
import { getUsers } from './users.api'
import useSuggestionDataItems, { toSuggestionDataItem } from './useSuggestionDataItems'

export type EnhancedSuggestionDataItem = SuggestionDataItem & { author: PublicInAppUserDto }

interface OwnProps {
    people: PublicInAppUserDto[]
}

export type UseUserMentionProps = OwnProps

const useUserMention = ({ people }: UseUserMentionProps): MentionProps => {
    const { dataItems } = useSuggestionDataItems({ users: people })
    const { api, apiState } = useSubstrate()
    const { network } = useNetworks()
    const { t } = useTranslation()

    const getData = useCallback(
        async (query: string, callback: (data: SuggestionDataItem[]) => void) => {
            const data = [...dataItems]
            if (query.length >= 4) {
                const users = await getUsers({ display: query })
                const usersDataItems = await Promise.all(
                    users.map(async (user) => {
                        const identity = await getIdentity(user.web3address, api, apiState)
                        return toSuggestionDataItem(user, identity, network, t)
                    }),
                )

                usersDataItems.forEach((userDataItem) => {
                    if (!data.find((item) => item.id === userDataItem.id)) {
                        data.push(userDataItem)
                    }
                })
            }

            const filteredData = data.filter((d) => {
                const encoded = d.author.web3address ? encodeAddress(d.author.web3address, network.ss58Format) : ''
                return d.display?.includes(query) || encoded.includes(query)
            })
            return callback(filteredData)
        },
        [dataItems],
    )

    return {
        trigger: '@',
        data: getData,
        markup: '[@__display__](__id__)',
        renderSuggestion: (suggestion: SuggestionDataItem) => (
            <SuggestionItem
                user={(suggestion as EnhancedSuggestionDataItem).author}
                showI={false}
                ellipsis={false}
                detectYou={false}
            />
        ),
        displayTransform: (id: string, display: string) => `@${display}`,
        appendSpaceOnAdd: true,
    }
}
export default useUserMention
