import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import ToggleButtonGroup from '../../components/toggle/toggle-redirect/ToggleButtonGroup'
import { SignOption } from './SignOption'
import { ToggleEntry } from '../../components/toggle/toggle-redirect/ToggleButton'
import { useRouteMatch } from 'react-router-dom'
import { SignComponentWrapper } from './SignComponentWrapper'

const useStyles = makeStyles(() =>
    createStyles({
        toggleContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        toggle: {
            height: '46px',
            width: '100%',
        },
    }),
)

export interface SignToggleProps {
    getTranslation: (option: SignOption) => string
}

const SignToggle = ({ getTranslation }: SignToggleProps) => {
    const classes = useStyles()
    let { path } = useRouteMatch()

    const signUpOptions = Object.values(SignOption)

    const toggleEntries = signUpOptions.map((option: SignOption) => {
        return {
            label: getTranslation(option),
            path: `${path}/${option}`,
        } as ToggleEntry
    })

    return (
        <div className={classes.toggleContainer}>
            <SignComponentWrapper>
                <ToggleButtonGroup className={classes.toggle} toggleEntries={toggleEntries} />
            </SignComponentWrapper>
        </div>
    )
}

export default SignToggle
