import { gql } from 'graphql-request'

const onchainLinkTreasuryProposal = gql`
    fragment onchainLinkTreasuryProposal on onchain_links {
        id
        proposer_address
        onchain_treasury_proposal_id
        onchain_motion_id
        onchain_treasury_spend_proposal(where: {}) {
            id
            beneficiary
            proposer
            treasuryProposalId
            value
            bond
            treasuryStatus(orderBy: id_DESC) {
                id
                status
                blockNumber {
                    number
                }
            }
        }
    }
`

const treasuryProposalPost = gql`
    fragment treasuryProposalPost on posts {
        content
        id
        title
        onchain_link {
            ...onchainLinkTreasuryProposal
        }
    }
    ${onchainLinkTreasuryProposal}
`

export const OneTreasuryProposalPost = gql`
    query TreasuryProposalPost($id: Int!) {
        posts(where: { onchain_link: { onchain_treasury_proposal_id: { _eq: $id } } }) {
            ...treasuryProposalPost
        }
    }
    ${treasuryProposalPost}
`

export const TreasuryProposalPosts = gql`
    query TreasuryProposalPosts(
        $offset: Int! = 0
        $limit: Int! = 1000
        $excludeIndexes: [Int!]
        $includeIndexes: [Int!]
        $proposers: [String!]
    ) {
        posts(
            offset: $offset
            limit: $limit
            where: {
                onchain_link: {
                    _and: [
                        { onchain_treasury_proposal_id: { _is_null: false, _nin: $excludeIndexes } }
                        {
                            _or: [
                                { onchain_treasury_proposal_id: { _in: $includeIndexes } }
                                { proposer_address: { _in: $proposers } }
                            ]
                        }
                    ]
                }
            }
            order_by: { onchain_link: { onchain_treasury_proposal_id: desc } }
        ) {
            ...treasuryProposalPost
        }
    }
    ${treasuryProposalPost}
`
export const TreasuryProposalPostsCount = gql`
    query TreasuryProposalPostsCount($excludeIndexes: [Int!], $includeIndexes: [Int!], $proposers: [String!]) {
        onchain_links_aggregate(
            where: {
                _and: [
                    { onchain_treasury_proposal_id: { _is_null: false, _nin: $excludeIndexes } }
                    {
                        _or: [
                            { onchain_treasury_proposal_id: { _in: $includeIndexes } }
                            { proposer_address: { _in: $proposers } }
                        ]
                    }
                ]
            }
        ) {
            aggregate {
                count
            }
        }
    }
`
