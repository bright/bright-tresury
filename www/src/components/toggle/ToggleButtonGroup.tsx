import React from 'react'
import { ToggleButtonGroup as MaterialToggleButtonGroup } from '@material-ui/lab'
import { ToggleButton, ToggleEntry } from './ToggleButton'

interface OwnProps {
    toggleEntries: ToggleEntry[]
    className?: string
}

export const ToggleButtonGroup: React.FC<OwnProps> = ({ toggleEntries, className }) => {
    return (
        <MaterialToggleButtonGroup className={className}>
            {toggleEntries.map((entry: ToggleEntry, index: number) => (
                <ToggleButton key={index} entry={entry} />
            ))}
        </MaterialToggleButtonGroup>
    )
}
