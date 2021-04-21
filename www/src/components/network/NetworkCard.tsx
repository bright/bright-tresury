import React, {HTMLAttributes} from "react";
import {createStyles, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Card} from "../card/Card";
import config from "../../config/index";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            transform: 'scale(1.01)'
        },
        transition: 'transform 0.2s',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
    },
    content: {
        margin: '0 20px 0 24px'
    },
    networkAccentLine: {
        backgroundColor: '#E6007A',
        height: '100%',
        width: '4px',
        position: 'absolute'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    },
}))

interface Props {
    network?: string
    redirectTo?: string
    showNetworkAccentLine?: boolean
}

export const NetworkCard: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  children, network = config.NETWORK_NAME, showNetworkAccentLine = true, redirectTo, ...props }
) => {

    const classes = useStyles()

    const content = (
        <div className={classes.content}>
            { children }
        </div>
    )

    return (
        <Card className={classes.root} {...props}>
            { showNetworkAccentLine
                ? <div className={classes.networkAccentLine} />
                : null
            }
            { redirectTo
                ? <Link className={classes.link} to={redirectTo}>{content}</Link>
                : content
            }
        </Card>
    )
}
