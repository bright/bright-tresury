import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {breakpoints} from "../../theme/theme";
import {Button, ButtonProps} from "../button/Button";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonsContainer: {
            margin: '3em 0',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            flexDirection: 'row-reverse',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                justifyContent: 'inherit',
                flexDirection: 'column-reverse'
            },
        },
        buttons: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%'
            },
        },
        leftButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: '2em'
            },
        }
    }),
);

export const FormButtonsContainer: React.FC = ({children}) => {
    const classes = useStyles()

    return <div className={classes.buttonsContainer}>
        {children}
    </div>
}

export const RightButton: React.FC<ButtonProps> = ({children, ...props}) => {
    const classes = useStyles()
    return <Button
        className={classes.buttons}
        variant={"contained"} color="primary" type="submit"
        {...props}>
        {children}
    </Button>
}

export const LeftButton: React.FC<ButtonProps> = ({children, ...props}) => {
    const classes = useStyles()
    return <Button
        className={`${classes.buttons} ${classes.leftButton}`}
        variant={"outlined"} color="primary" type="submit"
        {...props}>
        {children}
    </Button>
}
