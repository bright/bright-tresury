import React from "react";
import {ToggleButtonGroup} from "../../components/toggle/ToggleButtonGroup";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {DefaultSignOption, SignOption} from "./SignOption";
import {ToggleEntry} from "../../components/toggle/ToggleButton";
import {Location} from "history";
import {useRouteMatch} from "react-router-dom";
import {SignComponentWrapper} from "./SignComponentWrapper";

const useStyles = makeStyles(() =>
    createStyles({
        toggleContainer: {
            display: 'flex',
            justifyContent: 'center'
        },
        toggle: {
            width: '100%',
        }
    }),
);

interface OwnProps {
    getTranslation: (option: SignOption) => string
}

export const SignToggle: React.FC<OwnProps> = ({getTranslation}) => {
    const classes = useStyles()
    let {path} = useRouteMatch();

    const signUpOptions = Object.values(SignOption)

    const toggleEntries = signUpOptions.map((option: SignOption) => {
        return {
            label: getTranslation(option),
            path: `${path}/${option}`
        } as ToggleEntry
    })

    const isActiveToggle = (entry: ToggleEntry, location: Location) => {
        const isEntryPath = entry.path === location.pathname
        if (isEntryPath) {
            return true
        } else {
            const isAnyEntryPath = toggleEntries.find((entry) => entry.path === location.pathname)
            return isAnyEntryPath ? false : entry.label === getTranslation(DefaultSignOption)
        }
    }

    return <div className={classes.toggleContainer}>
        <SignComponentWrapper>
            <ToggleButtonGroup
                className={classes.toggle}
                toggleEntries={toggleEntries}
                isActive={isActiveToggle}
            />
        </SignComponentWrapper>
    </div>
}
