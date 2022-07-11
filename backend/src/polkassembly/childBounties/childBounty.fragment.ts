import { gql } from 'graphql-request'

const onChainChildBounty = gql`
    fragment onChainChildBounty on ChildBounty {
        beneficiary
        childBountyId
        curator
        curatorDeposit
        description
        fee
        id
        parentBountyId
        proposer
        value
        childBountyStatus {
            uniqueStatus
            status
            id
            blockNumber {
                startDateTime
                number
            }
        }
    }
`

const onchainLinkChildBounty = gql`
    fragment onchainLinkChildBounty on onchain_links {
        id
        proposer_address
        onchain_child_bounty_id
        onchain_child_bounty(where: {}) {
            ...onChainChildBounty
        }
    }
    ${onChainChildBounty}
`
const childBountyPost = gql`
    fragment childBountyPost on posts {
        content
        id
        title
        onchain_link {
            ...onchainLinkChildBounty
        }
    }
    ${onchainLinkChildBounty}
`

export const OneChildBountyPost = gql`
    query ChildBountyPost($id: Int!) {
        posts(where: { onchain_link: { onchain_child_bounty_id: { _eq: $id } } }) {
            ...childBountyPost
        }
    }
    ${childBountyPost}
`

export const ChildBountyPosts = gql`
    query ChildBountyPosts(
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
                        { onchain_child_bounty_id: { _is_null: false, _nin: $excludeIndexes } }
                        { onchain_child_bounty_id: { _in: $includeIndexes } }
                    ]
                }
            }
            order_by: { onchain_link: { onchain_child_bounty_id: desc } }
        ) {
            ...childBountyPost
        }
    }
    ${childBountyPost}
`
