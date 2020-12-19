import React from 'react';
import CrossSvg from "../../assets/cross.svg";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {Header} from "../../components/header/Header";
import {ROUTE_IDEAS} from "../../routes";
import {IconButton} from "../../components/button/IconButton";
import {IdeaDto} from "../ideas.api";
import {Button} from "../../components/button/Button";
import SubmitProposalModal from "../SubmitProposalModal";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            padding: '3em 5em 3em 3em',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        closeIcon: {
            position: 'absolute',
            top: 32,
            right: 32,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                top: 32,
                right: 24,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                top: 26,
                right: 8,
            }
        },
        basicInfo: {
            display: 'flex',
            flexDirection: 'column'
        },
        networkValues: {
            display: 'flex'
        },
        ideaId: {
            fontSize: '18px',
        },
        flexBreakLine: {
            flexBasis: '100%',
            height: 0,
        }
    }),
);

interface Props {
    idea: IdeaDto
}

const IdeaHeader: React.FC<Props> = ({idea}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

    const [submitProposalVisibility, setSubmitProposalVisibility] = React.useState(false);

    const navigateToList = () => {
        history.push(ROUTE_IDEAS)
    }

    return <div className={classes.headerContainer}>
        <IconButton className={classes.closeIcon} svg={CrossSvg} onClick={navigateToList}/>

        <div className={classes.basicInfo}>
            <p className={classes.ideaId}>
                {idea.id}
            </p>
            <Header>
                {idea.title}
            </Header>
        </div>
        <div className={classes.networkValues}>
            <p>Reward 1,950.000 DOT</p>
            <p>Deposit 1,950.000 DOT</p>
        </div>
        <div className={classes.flexBreakLine}/>
        <div>Tabs</div>
        {!!idea.id && <Button
            variant="contained"
            color="primary"
            onClick={() => setSubmitProposalVisibility(true)}>
            {t('idea.details.submitProposal')}
        </Button>
        }
        <SubmitProposalModal
            open={submitProposalVisibility}
            onClose={() => setSubmitProposalVisibility(false)}
            idea={idea}/>
    </div>
}

export default IdeaHeader
