import { useMutation } from 'react-query'
import { apiDelete, apiPost } from '../api'

/*
 We pass the `signOut` function to `useMutation` hook from the react-query lib.
 It's not possible to call the `mutate` function from the hook with an empty `variables` object.
 This is why we need to define an empty object as parameter of this function.
 */
function signOut({}) {
    return apiPost(`/signout`)
}

export function useSignOut() {
    return useMutation(signOut)
}

// DELETE ACCOUNT

export const USERS_API_PATH = '/users'

export interface DeleteUserDto {
    userId: string
}

function deleteUser({ userId }: DeleteUserDto): Promise<void> {
    return apiDelete(`${USERS_API_PATH}/${userId}`)
}

export const useDeleteUser = () => {
    return useMutation(deleteUser)
}
