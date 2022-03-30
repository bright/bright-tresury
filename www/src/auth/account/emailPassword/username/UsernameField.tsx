import React, { useMemo, useState } from 'react'
import { ClassNameProps } from '../../../../components/props/className.props'
import { useGetUserSettings } from '../../user-settings.api'
import UsernameDisplay from './UsernameDisplay'
import UsernameEdit from './UsernameEdit'

interface OwnProps {
    userId: string
}

type UsernameFieldProps = OwnProps & ClassNameProps

const UsernameField = ({ userId }: UsernameFieldProps) => {
    const { data } = useGetUserSettings({ userId })
    const [editMode, setEditMode] = useState(false)

    const username = useMemo(() => data?.username ?? '', [data])

    const openEditMode = () => setEditMode(true)
    const closeEditMode = () => setEditMode(false)

    return (
        <>
            {editMode ? (
                <UsernameEdit userId={userId} username={username} onClose={closeEditMode} />
            ) : (
                <UsernameDisplay username={username} onEditClick={openEditMode} />
            )}
        </>
    )
}

export default UsernameField
