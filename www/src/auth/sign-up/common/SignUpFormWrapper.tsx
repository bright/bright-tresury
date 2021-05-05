import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
    }),
);

interface OwnProps {
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}

export const SignUpFormWrapper: React.FC<OwnProps> = ({handleSubmit, children}) => {
    const classes = useStyles()

    return <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
        {children}
    </form>
}
