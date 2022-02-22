import request, { gql } from 'graphql-request'
import { useMutation } from 'react-query'
import { handleWeb3Sign, StartWeb3SignResponseDto } from '../../auth/handleWeb3Sign'
import {
    ConfirmMutationRequestDto,
    PostMutationWeb3SignDetailsDto,
    StartMutationRequestDto,
} from './polkassembly-posts.dto'

const getPostSignContent = (
    {
        address,
        details: {
            network,
            postData: { title, content },
        },
    }: StartMutationRequestDto,
    challenge: string,
) =>
    `<Bytes>network:${network.id}::address:${address}::title:${title}::content:${content}::challenge:${challenge}</Bytes>`

async function startMutation(dto: StartMutationRequestDto): Promise<StartWeb3SignResponseDto> {
    const apiUrl = dto.details.network.polkassemblyUrl
    const mutation = gql`
        mutation start($address: String!) {
            editPostStart(address: $address) {
                signMessage
                message
            }
        }
    `

    const {
        editPostStart: { signMessage, message },
    } = await request(apiUrl, mutation, { address: dto.address })
    console.log(message)
    const signContent = getPostSignContent(dto, signMessage)
    return {
        signMessage: signContent,
    }
}

async function confirmMutation({
    address,
    signature,
    details: { network, postData },
}: ConfirmMutationRequestDto): Promise<void> {
    const apiUrl = network.polkassemblyUrl

    const mutation = gql`
        mutation confirm(
            $network: String!
            $address: String!
            $proposalType: String!
            $proposalId: String!
            $title: String!
            $content: String!
            $signature: String!
        ) {
            editPostConfirm(
                network: $network
                address: $address
                proposalType: $proposalType
                proposalId: $proposalId
                title: $title
                content: $content
                signature: $signature
            ) {
                message
            }
        }
    `

    const {
        editPostConfirm: { message },
    } = await request(apiUrl, mutation, {
        network: network.id,
        address,
        proposalType: postData.type,
        proposalId: postData.onChainIndex.toString(),
        title: postData.title,
        content: postData.content,
        signature,
    })
    console.log(message)
}

function handlePolkassemblyShare(dto: { account: string; details: PostMutationWeb3SignDetailsDto }) {
    return handleWeb3Sign(dto.account, startMutation, confirmMutation, dto.details)
}

export const usePolkassemblyShare = () => {
    return useMutation(handlePolkassemblyShare)
}
