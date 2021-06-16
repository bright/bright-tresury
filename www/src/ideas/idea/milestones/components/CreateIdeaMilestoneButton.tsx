import React from 'react'
import Button from '../../../../components/button/Button'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../../theme/theme'
import { mobileHeaderListHorizontalMargin } from '../../../../components/header/list/HeaderListContainer'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newIdeaMilestoneButton: {
            fontWeight: 700,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                fontSize: '15px',
                margin: `0px ${mobileHeaderListHorizontalMargin}`,
                flex: 1,
            },
        },
    }),
)

interface OwnProps {
    text: string
    onClick: () => void
}

export type CreateIdeaMilestoneButtonProps = OwnProps

const CreateIdeaMilestoneButton = ({ text, onClick }: CreateIdeaMilestoneButtonProps) => {
    const classes = useStyles()

    return (
        <Button variant="text" color="primary" className={classes.newIdeaMilestoneButton} onClick={onClick}>
            {text}
        </Button>
    )
}

export default CreateIdeaMilestoneButton
