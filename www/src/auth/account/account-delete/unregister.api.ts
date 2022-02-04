import { useMutation } from 'react-query'
import { apiDelete } from '../../../api'

export const UNREGISTER_API_PATH = '/auth/unregister'

function deleteUser({}): Promise<void> {
    return apiDelete(`${UNREGISTER_API_PATH}`)
}

export const useDeleteUser = () => {
    return useMutation(deleteUser)
}
