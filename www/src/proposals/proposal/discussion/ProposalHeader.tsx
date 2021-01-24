import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import ProposalContentTypeTabs from "../ProposalContentTypeTabs";
import {breakpoints} from "../../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            background: theme.palette.background.default,
            padding: '2em 7em 2em 3em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 2.2em 1em 2.2em'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: 0,
                paddingRight: 0
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
    }),
);

const ProposalHeader: React.FC = () => {
    const classes = useStyles()

    return <div className={classes.headerContainer}>
        <ProposalContentTypeTabs/>
    </div>
}

export default ProposalHeader
