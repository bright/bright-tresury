import { useMutation } from 'react-query'
import {
    ConfirmWeb3SignRequestDto,
    handleWeb3Sign,
    StartWeb3SignRequestDto,
    StartWeb3SignResponseDto,
} from '../auth/handleWeb3Sign'
import { Network } from '../networks/networks.dto'
import { Nil } from '../util/types'

const getPostSignContent = (
    { address, details: { network, username, email, title, content } }: StartMutationRequestDto,
    challenge: string,
) =>
    `<Bytes>network:${network.id}::address:${address}::username:${username || ''}::email:${
        email || ''
    }::title:${title}::content:${content}::challenge:${challenge}</Bytes>`

interface PostMutationWeb3SignDetailsDto {
    network: Network
    title: string
    content: string
    username?: Nil<string>
    email?: Nil<string>
}

export type StartMutationRequestDto = StartWeb3SignRequestDto & {
    details: PostMutationWeb3SignDetailsDto
}

async function startMutation(dto: StartMutationRequestDto): Promise<StartWeb3SignResponseDto> {
    // TODO implement actual mutation in TREAS-386
    // const apiUrl = dto.details.network.polkassemblyUrl
    // const mutation = gql`
    //     mutation editPostStart(${dto.address}) {
    //         signMessage
    //         message
    //     }
    //
    // `
    // const { signMessage, message } = await request(apiUrl, mutation)
    debugger
    const { signMessage, message } = {
        signMessage: '85888663-aa7d-4387-b7be-2a4e80fb2c4d',
        message: 'Post edition started. Please sign the message with your account to create post',
    }
    console.log(message)
    const signContent = getPostSignContent(dto, signMessage)
    return {
        signMessage: signContent,
    }
}

export type ConfirmMutationRequestDto = ConfirmWeb3SignRequestDto & {
    details: PostMutationWeb3SignDetailsDto
}

async function confirmMutation({ address, signature, details }: ConfirmMutationRequestDto): Promise<void> {
    // TODO implement actual mutation in TREAS-386
    // const toSend = { address, signature, ...details }
    // const apiUrl = dto.details.network.polkassemblyUrl
    // const mutation = gql`
    //     mutation editPostStart($address: String!) {
    //         createPostStart($address) {
    //             signMessage
    //             message
    //         }
    //     }
    // `
    // const {message} = await request(apiUrl, mutation)
    // console.log(message)
    console.log('Post edition confirmed.')
    return
}

function handlePolkassemblyShare(dto: { account: string; details: PostMutationWeb3SignDetailsDto }) {
    return handleWeb3Sign(dto.account, startMutation, confirmMutation, dto.details)
}

export const usePolkassemblyShare = () => {
    return useMutation(handlePolkassemblyShare)
}
