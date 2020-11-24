import {MenuItem, MenuItemProps, SelectProps} from "@material-ui/core";
import React from "react";

interface SelectItemProps<T> {
    value: T
    renderValue?: string
}

export const SelectItem: React.FC<SelectItemProps<any> & MenuItemProps> = ({value, renderValue, ...props}) => {
    return <MenuItem value={value}>
        {renderValue ?? value}
    </MenuItem>
}
