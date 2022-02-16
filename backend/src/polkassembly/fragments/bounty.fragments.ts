import { gql } from 'graphql-request'

const onchainLinkBounty = gql`
    fragment onchainLinkBounty on onchain_links {
        id
        proposer_address
        onchain_bounty_id
        onchain_bounty(where: {}) {
            id
            proposer
            value
            fee
            curatorDeposit
            bond
            bountyId
            curator
            beneficiary
            bountyStatus(orderBy: id_DESC) {
                id
                status
                blockNumber {
                    startDateTime
                    number
                }
            }
        }
    }
`
const bountyPost = gql`
    fragment bountyPost on posts {
        content
        id
        title
        onchain_link {
            ...onchainLinkBounty
        }
    }
    ${onchainLinkBounty}
`

export const OneBountyPost = gql`
    query BountyPostAndComments($id: Int!) {
        posts(where: { onchain_link: { onchain_bounty_id: { _eq: $id } } }) {
            ...bountyPost
        }
    }
    ${bountyPost}
`

export const BountyPosts = gql`
    query OnChainBountyPostAndComments(
        $offset: Int! = 0
        $limit: Int! = 1000
        $includeIndexes: [Int!]
        $excludeIndexes: [Int!]
    ) {
        posts(
            offset: $offset
            limit: $limit
            where: { onchain_link: { onchain_bounty_id: { _in: $includeIndexes } } }
            order_by: { onchain_link: { onchain_bounty_id: desc } }
        ) {
            ...bountyPost
        }
    }
    ${bountyPost}
`

export const OffChainBountyPosts = gql`
    query OffChainBountyPostAndComments(
        $offset: Int! = 0
        $limit: Int! = 1000
        $includeIndexes: [Int!]
        $excludeIndexes: [Int!]
    ) {
        posts(
            offset: $offset
            limit: $limit
            where: { onchain_link: { onchain_bounty_id: { _is_null: false, _nin: $excludeIndexes } } }
            order_by: { onchain_link: { onchain_bounty_id: desc } }
        ) {
            ...bountyPost
        }
    }
    ${bountyPost}
`
