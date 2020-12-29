import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => {
    const size = '32px'
    return createStyles({
        identicon: {
            width: size,
            height: size,
            //TODO: remove once Identicon will be implemented
            backgroundColor: 'tomato',
            color: 'white',
            borderRadius: 32
        }
    })
});

interface Props {
    account: string
}

export const Identicon: React.FC<Props> = ({account}) => {
    const classes = useStyles()
    return <div className={classes.identicon}>
        {/*TODO: implement Identicon*/}
        {account.substring(0, 2)}
    </div>
}
