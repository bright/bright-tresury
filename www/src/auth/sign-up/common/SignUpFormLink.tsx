import {Link, LinkProps} from "../../../components/link/Link";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    link: {
        textDecoration: 'underline',
    },
}))

export const SignUpFormLink: React.FC<LinkProps> = (props) => {
    const classes = useStyles()
    return <Link className={classes.link} {...props}/>
}
