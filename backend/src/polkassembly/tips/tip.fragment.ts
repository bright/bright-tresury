import { gql } from 'graphql-request'

const Tip = gql`
    fragment Tip on Tip {
        id
        hash
        reason
        finder
        finderFee
        closes
        who
        tipStatus(orderBy: id_DESC) {
            id
            status
            blockNumber {
                startDateTime
                number
            }
        }
    }
`

const OnchainTipLink = gql`
    fragment OnchainTipLink on onchain_links {
        id
        onchain_tip_id
        onchain_tip {
            ...Tip
        }
    }
    ${Tip}
`

const TipPost = gql`
    fragment TipPost on posts {
        id
        content
        title
        onchain_link {
            ...OnchainTipLink
        }
    }
    ${OnchainTipLink}
`

export const TipsPosts = gql`
    query TipPosts(
        $offset: Int! = 0
        $limit: Int! = 1000
        $includeHashes: [String!]
        $excludeHashes: [String!]
        $finderAddresses: [String!]
    ) {
        posts(
            offset: $offset
            limit: $limit
            where: {
                onchain_link: {
                    proposer_address: { _in: $finderAddresses }
                    onchain_tip_id: { _is_null: false, _in: $includeHashes, _nin: $excludeHashes }
                }
            }
            order_by: { onchain_link: { onchain_tip_id: desc } }
        ) {
            ...TipPost
        }
    }
    ${TipPost}
`

export const TipsPostsCount = gql`
    query TipPostsCount($includeHashes: [String!], $excludeHashes: [String!], $finderAddresses: [String!]) {
        onchain_links_aggregate(
            where: {
                onchain_tip_id: { _is_null: false, _in: $includeHashes, _nin: $excludeHashes }
                proposer_address: { _in: $finderAddresses }
            }
        ) {
            aggregate {
                count
            }
        }
    }
    ${TipPost}
`
