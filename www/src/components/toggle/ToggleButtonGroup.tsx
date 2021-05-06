import React from "react";
import {ToggleButtonGroup as MaterialToggleButtonGroup} from "@material-ui/lab";
import {ToggleButton, ToggleEntry} from "./ToggleButton";
import {Location} from "history";

interface OwnProps {
    toggleEntries: ToggleEntry[]
    isActive: (entry: ToggleEntry, location: Location) => boolean
    className?: string
}

export const ToggleButtonGroup: React.FC<OwnProps> = ({toggleEntries, isActive, className}) => {
    return <MaterialToggleButtonGroup className={className}>
        {toggleEntries.map((entry: ToggleEntry, index: number) =>
            <ToggleButton key={index} entry={entry} isActive={isActive}/>
        )}
    </MaterialToggleButtonGroup>
};

