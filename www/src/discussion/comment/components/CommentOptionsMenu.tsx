import { MenuItem } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../../components/modal/useModal'
import { useMenu } from '../../../hook/useMenu'
import OptionsButton from '../../../components/header/details/OptionsButton'
import { ClassNameProps } from '../../../components/props/className.props'
import { CommentDto, DiscussionDto } from '../../comments.dto'
import DeleteCommentModal from '../DeleteCommentModal'

interface OwnProps {
    comment: CommentDto
    discussion: DiscussionDto
    onEdit: () => void
}

export type CommentOptionsMenuProps = OwnProps & ClassNameProps

const CommentOptionsMenu = ({ onEdit, comment, discussion, className }: CommentOptionsMenuProps) => {
    const { t } = useTranslation()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    const deleteCommentModal = useModal()

    const onDeleteClick = () => {
        deleteCommentModal.open()
        handleClose()
    }

    const onEditClick = () => {
        onEdit()
        handleClose()
    }

    return (
        <>
            <OptionsButton
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
                handleOpen={handleOpen}
                className={className}
            >
                <MenuItem key={'EditComment'} onClick={onEditClick}>
                    {t('discussion.optionsMenu.edit')}
                </MenuItem>
                <MenuItem key={'DeleteComment'} onClick={onDeleteClick}>
                    {t('discussion.optionsMenu.delete')}
                </MenuItem>
            </OptionsButton>
            <DeleteCommentModal
                comment={comment}
                discussion={discussion}
                onClose={deleteCommentModal.close}
                open={deleteCommentModal.visible}
            />
        </>
    )
}
export default CommentOptionsMenu
