import { gql } from 'graphql-request'

export const TreasuryProposalPost = gql`
query TreasuryProposalPost ($id:Int!) {
        posts(where: {onchain_link: {onchain_treasury_proposal_id: {_eq: $id}}}) {
            content
            id
            title
            onchain_link {
                onchain_treasury_proposal_id
            }
        }
}
`
export const TreasuryProposalPosts = gql`
query TreasuryProposalPosts ($ids:[Int!]) {
        posts(where: {onchain_link: {onchain_treasury_proposal_id: {_in: $ids}}}) {
            content
            id
            title
            onchain_link {
                onchain_treasury_proposal_id
            }
        }
}
`
// TODO: add polkassembly.service implementations for those bounties query fragments
export const BountyPost = gql`
    query BountyPostAndComments ($id: Int!) {
        posts(where: {onchain_link: {onchain_bounty_id: {_eq: $id}}}) {
            title
            content
            onchain_link {
                onchain_bounty_id
            }
        }
    }
`;

export const BountyPosts = gql`
    query BountyPostAndComments ($ids:[Int!]) {
        posts(where: {onchain_link: {onchain_bounty_id: {_in: $ids}}}) {
            title
            content
            onchain_link {
                onchain_bounty_id
            }
        }
    }
`;
