import { encodeAddress } from '@polkadot/util-crypto'
import React, { useCallback, useMemo } from 'react'
import { MentionProps, SuggestionDataItem } from 'react-mentions'
import { UserStatus } from '../../../../auth/AuthContext'
import { useNetworks } from '../../../../networks/useNetworks'

import SuggestionItem from './SuggesionItem'
import { getUsers } from './users.api'
import { PublicUserDto } from '../../../../util/publicUser.dto'

export type EnhancedSuggestionDataItem = SuggestionDataItem & { author: PublicUserDto }

interface OwnProps {
    people: PublicUserDto[]
}

export type UseUserMentionProps = OwnProps

const useUserMention = ({ people }: UseUserMentionProps): MentionProps => {
    const { network } = useNetworks()

    const toSuggestionDataItem = (author: PublicUserDto) => ({
        id: author.userId!,
        display:
            // todo use unified method to get display name TREAS-458
            (author.status === UserStatus.EmailPasswordEnabled
                ? author.username ?? author.userId
                : author.web3address
                ? encodeAddress(author.web3address, network.ss58Format)
                : author.userId) ?? undefined,
        author: author,
    })

    const data = useMemo(() => people.map((person) => toSuggestionDataItem(person)), [people, network])

    const getData = useCallback(
        async (query: string, callback: (data: SuggestionDataItem[]) => void) => {
            if (query.length >= 4) {
                const users = await getUsers({ display: query })

                users.forEach((user) => {
                    if (!people.find((person) => person.userId === user.userId)) {
                        data.push(toSuggestionDataItem(user))
                    }
                })
            }

            const filteredData = data.filter((d) => d.display?.includes(query) || d.author.web3address?.includes(query))
            return callback(filteredData)
        },
        [people],
    )

    return {
        trigger: '@',
        data: getData,
        markup: '[@__display__](__id__)',
        renderSuggestion: (suggestion: SuggestionDataItem) => (
            <SuggestionItem user={(suggestion as EnhancedSuggestionDataItem).author} />
        ),
        displayTransform: (id: string, display: string) => `@${display}`,
        appendSpaceOnAdd: true,
    }
}
export default useUserMention
