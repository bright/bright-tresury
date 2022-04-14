import React from 'react'
import { ToggleButtonGroup as MaterialToggleButtonGroup } from '@material-ui/lab'
import ToggleButton, { ToggleEntry } from './ToggleButton'

interface OwnProps {
    toggleEntries: ToggleEntry[]
    className?: string
}

export type ToggleButtonGroupProps = OwnProps

const ToggleButtonGroup = ({ toggleEntries, className }: ToggleButtonGroupProps) => {
    return (
        <MaterialToggleButtonGroup className={className}>
            {toggleEntries.map((entry: ToggleEntry, index: number) => (
                <ToggleButton key={index} entry={entry} />
            ))}
        </MaterialToggleButtonGroup>
    )
}

export default ToggleButtonGroup
