import {Step, StepIconProps, StepLabel, Stepper as MaterialStepper, StepperProps, Theme, withStyles} from "@material-ui/core";
import StepConnector from '@material-ui/core/StepConnector';
import React from "react";
import done from './assets/done.svg';
import inProgress from './assets/in-progress.svg';
import todo from './assets/to-do.svg';

const StyledStepConnector = withStyles((theme: Theme) => ({
    active: {
        '& $line': {
            borderColor: theme.palette.primary.main,
        },
    },
    completed: {
        '& $line': {
            borderColor: theme.palette.primary.main,
        },
    },
    line: {
        borderColor: '#F0F0F0',
        borderTopWidth: 1,
    },
}))(StepConnector);

function StepIcon(props: StepIconProps) {
    const {active, completed} = props;

    return (
        <>
            {active ? <img src={inProgress} alt=''/> : (
                completed ? <img src={done} alt=''/>
                    : <img src={todo} alt=''/>)}
        </>
    );
}

export type Props = {
    steps: string[]
} & StepperProps

export const Stepper: React.FC<Props> = ({steps, alternativeLabel, ...props}) => {
    return <MaterialStepper
        alternativeLabel={alternativeLabel !== undefined ? alternativeLabel : true}
        {...props}
        connector={<StyledStepConnector/>}
    >
        {steps.map((label) => (
            <Step key={label}>
                <StepLabel
                    StepIconComponent={StepIcon}
                >{label}</StepLabel>
            </Step>
        ))}
    </MaterialStepper>
}

