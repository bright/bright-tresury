import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {breakpoints} from "../../../../theme/theme";
import SendVerifyEmailButton from "../../../verifyEmail/SendVerifyEmailButton";
import VerifyErrorLabel from "./VerifyErrorLabel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                width: '100%',
                flexWrap: 'wrap',
            },
            justifyContent: 'space-between',
        },
    }),
)

const EmailNotVerifiedError = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <VerifyErrorLabel/>
            <SendVerifyEmailButton variant='text'/>
        </div>
    )
}

export default EmailNotVerifiedError
