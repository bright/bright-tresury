import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import DateRangeInput from '../../../../../milestone-details/components/form/DateRangeInput'
import DescriptionInput from '../../../../../milestone-details/components/form/DescriptionInput'
import SubjectInput from '../../../../../milestone-details/components/form/SubjectInput'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2em',
            marginTop: '1em',
        },
    }),
)

interface OwnProps {
    readonly: boolean
}

export type IdeaMilestoneFormFieldsProps = OwnProps

const ProposalMilestoneFormFields = ({ readonly }: IdeaMilestoneFormFieldsProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <SubjectInput readonly={readonly} />
            <DateRangeInput readonly={readonly} />
            <DescriptionInput readonly={readonly} />
        </div>
    )
}

export default ProposalMilestoneFormFields
