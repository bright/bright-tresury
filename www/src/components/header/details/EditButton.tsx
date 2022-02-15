import React from 'react'
import Button, { ButtonProps } from '../../button/Button'
import EditButtonImg from './EditButtonImg'

interface OwnProps {
    label: string
}

export type EditButtonProps = OwnProps & ButtonProps

const EditButton = ({ label, ...props }: EditButtonProps) => {
    return (
        <Button color={'primary'} variant={'text'} {...props}>
            <EditButtonImg alt={label} />
            {label}
        </Button>
    )
}

export default EditButton
