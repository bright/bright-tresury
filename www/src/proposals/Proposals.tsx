import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            header: {}
        })
    }
)

const Proposals: React.FC<{}> = () => {
    const classes = useStyles()
    return (
        <div>
            <div className={classes.header}>

            </div>
            Proposals
        </div>
    );
}

export default Proposals
