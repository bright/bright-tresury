import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import editIcon from '../../../assets/edit_icon.svg'

const useStyles = makeStyles(() =>
    createStyles({
        editIcon: {
            width: '14.5px',
            marginBottom: '2px',
            marginRight: '2px',
        },
    }),
)

interface OwnProps {
    alt: string
}

export type EditButtonImgProps = OwnProps

const EditButtonImg = ({ alt }: EditButtonImgProps) => {
    const classes = useStyles()

    return <img className={classes.editIcon} src={editIcon} alt={alt} />
}

export default EditButtonImg
