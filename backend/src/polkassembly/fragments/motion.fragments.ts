import { gql } from 'graphql-request'

export const Motions = gql`
    query Motions($argumentName: String!, $argumentValue: String!) {
        motions(
            where: {
                section_in: ["treasury", "bounties"]
                motionProposalArguments_some: { name: $argumentName, value: $argumentValue }
            }
        ) {
            id
            motionProposalId
            method
            memberCount
            section
            motionProposalArguments {
                name
                value
            }
            motionStatus {
                blockNumber {
                    number
                }
                status
            }
        }
    }
`
