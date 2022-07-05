import { UsersService } from '../../users/users.service'
import { getLogger } from '../../logging.module'
import { CommentEntity } from '../../discussions/entites/comment.entity'

const logger = getLogger()

export const getTaggedUsers = async (comment: CommentEntity) => {
    const taggedUsers: string[] = []

    const commentContainsTag = comment.content.match(/\[(?<text>.+)\]\((?<url>[^ ]+)(?: "(?<title>.+)")?\)/gim)

    if (commentContainsTag) {
        const userId = commentContainsTag[0].match(/(?<=\().+?(?=\))/gim)
        if (userId !== null) {
            for (const id of userId) {
                taggedUsers.push(id)
            }
        }
    }

    return [...new Set(taggedUsers)]
}

export const addUserFromWeb3Address = async (
    usersService: UsersService,
    web3address: string,
    receiverIds: string[],
): Promise<void> => {
    try {
        const user = await usersService.findOneByWeb3AddressOrThrow(web3address)
        receiverIds.push(user.id)
    } catch (err) {
        logger.info(`No user with address ${web3address} found`)
    }
}
