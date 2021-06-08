import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ClassNameProps } from '../../../../components/props/className.props'
import { Label } from '../../../../components/text/Label'

const useStyles = makeStyles(() =>
    createStyles({
        value: {
            fontWeight: 'normal',
            fontSize: '18px',
            marginTop: '8px',
            marginBottom: '0',
        },
    }),
)

interface OwnProps {
    title: string
    value: string
}

type DisabledFormFieldProps = OwnProps & ClassNameProps

const DisabledFormField = ({ title, value, className }: DisabledFormFieldProps) => {
    const classes = useStyles()
    return (
        <div className={className}>
            <Label label={title} />
            <p className={classes.value}>{value}</p>
        </div>
    )
}

export default DisabledFormField
