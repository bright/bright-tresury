import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        header: {
            fontSize: '1em',
            fontWeight: 'bold',
            color: '#1B1D1C',
        }
    }),
);

export const Header: React.FC = ({children}) => {
    const classes = useStyles()
    return <div className={classes.header} {...children}>{children}</div>;
};

