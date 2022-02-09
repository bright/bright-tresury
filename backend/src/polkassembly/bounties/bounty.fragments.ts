import { gql } from 'graphql-request'

const onChainBounty = gql`
    fragment onChainBounty on Bounty {
        id
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
`

const onchainLinkBounty = gql`
    fragment onchainLinkBounty on onchain_links {
        id
        proposer_address
        onchain_bounty_id
        onchain_bounty(where: {}) {
            ...onChainBounty
        }
    }
    ${onChainBounty}
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
    query BountyPost($id: Int!) {
        posts(where: { onchain_link: { onchain_bounty_id: { _eq: $id } } }) {
            ...bountyPost
        }
    }
    ${bountyPost}
`

export const BountyPosts = gql`
    query BountyPosts(
        $offset: Int! = 0
        $limit: Int! = 1000
        $includeIndexes: [Int!]
        $excludeIndexes: [Int!]
        $proposers: [String!]
    ) {
        posts(
            offset: $offset
            limit: $limit
            where: {
                onchain_link: {
                    _and: [
                        { onchain_bounty_id: { _is_null: false, _nin: $excludeIndexes } }
                        { onchain_bounty_id: { _in: $includeIndexes } }
                    ]
                }
            }
            order_by: { onchain_link: { onchain_bounty_id: desc } }
        ) {
            ...bountyPost
        }
    }
    ${bountyPost}
`

export const BountyPostsCount = gql`
    query BountyPostsCount($excludeIndexes: [Int!], $includeIndexes: [Int!], $proposers: [String!]) {
        onchain_links_aggregate(
            where: {
                _and: [
                    { onchain_bounty_id: { _is_null: false, _nin: $excludeIndexes } }
                    { onchain_bounty_id: { _in: $includeIndexes } }
                ]
            }
        ) {
            aggregate {
                count
            }
        }
    }
`
