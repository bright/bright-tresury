import React from "react";
import {createStyles, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Card} from "./Card";
import config from "../../config";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            transform: 'scale(1.01)'
        },
        transition: 'transform 0.2s',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
    },
    networkAccentLine: {
        backgroundColor: '#E6007A',
        height: '100%',
        width: '4px',
        position: 'absolute'
    },
}))

interface Props {
    network?: string
}

export const NetworkCard: React.FC<Props> = ({children, network = config.NETWORK_NAME, ...props}) => {
    const classes = useStyles()
    return <Card className={classes.root}>
        <div className={classes.networkAccentLine}/>
        {children}
    </Card>
}
