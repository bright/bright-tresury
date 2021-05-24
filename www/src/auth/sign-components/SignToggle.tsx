import React from 'react'
import { ToggleButtonGroup } from '../../components/toggle/ToggleButtonGroup'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { SignOption } from './SignOption'
import { ToggleEntry } from '../../components/toggle/ToggleButton'
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

interface OwnProps {
    getTranslation: (option: SignOption) => string
}

export const SignToggle: React.FC<OwnProps> = ({ getTranslation }) => {
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
