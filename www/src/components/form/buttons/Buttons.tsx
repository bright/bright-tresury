import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {breakpoints} from "../../../theme/theme";
import {Button, ButtonProps} from "../../button/Button";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
                marginTop: '2em'
            },
        },
        leftButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                marginTop: '2em'
            },
        }
    }),
);

export const RightButton: React.FC<ButtonProps> = ({children, ...props}) => {
    const classes = useStyles()
    return <Button
        className={classes.button}
        variant={"contained"} color="primary" type="submit"
        {...props}>
        {children}
    </Button>
}

export const LeftButton: React.FC<ButtonProps> = ({children, ...props}) => {
    const classes = useStyles()
    return <Button
        className={`${classes.button} ${classes.leftButton}`}
        variant={"outlined"} color="primary" type="submit"
        {...props}>
        {children}
    </Button>
}
