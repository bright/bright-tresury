import { Switch as MaterialSwitch, withStyles } from '@material-ui/core'
import React from 'react'

const Switch = withStyles((theme) => {
    return {
        switchBase: {
            color: theme.palette.text.disabled,
            '&$checked': {
                color: theme.palette.primary.main,
            },
            '&$checked + $track': {
                backgroundColor: theme.palette.primary.main,
            },
        },
        checked: {},
        track: {},
    }
})(MaterialSwitch)
export default Switch
