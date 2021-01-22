import {Step, StepIconProps, StepLabel, Stepper as MaterialStepper, StepperProps, Theme, withStyles} from "@material-ui/core";
import StepConnector from '@material-ui/core/StepConnector';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import React from "react";
import {breakpoints} from "../../theme/theme";
import done from './assets/done.svg';
import inProgress from './assets/in-progress.svg';
import todo from './assets/to-do.svg';

const StyledStepConnector = withStyles((theme: Theme) => ({
    root: {
        padding: 0,
    },
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
        borderWidth: 1,
        height: 60,
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
    steps: string[],
    width: any
} & StepperProps

const StepperComponent: React.FC<Props> = ({steps, ...props}) => {
    const orientation = props.orientation ?? (isWidthDown(breakpoints.mobile, props.width) ? 'vertical' : 'horizontal')
    const alternativeLabel = props.alternativeLabel !== undefined ? props.alternativeLabel : orientation === 'horizontal'

    return <MaterialStepper
        alternativeLabel={alternativeLabel}
        orientation={orientation}
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

export const Stepper = withWidth()(StepperComponent);
