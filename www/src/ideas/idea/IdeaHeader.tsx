import React, {useState} from 'react';
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
import {Status} from "../../components/status/Status";
import IdeaContentTypeTabs, {IdeaContentType} from "./IdeaContentTypeTabs";
import {Divider} from "../../components/divider/Divider";
import {Amount} from "../../components/amount/Amount";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            padding: '3em 5em 3em 3em',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
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
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        basicInfoDivider: {
            height: '20px',
            marginLeft: '2em'
        },
        status: {
            marginLeft: '2em'
        },
        ideaTitle: {
            flexBasis: '100%'
        },
        ideaId: {
            fontSize: '18px',
        },
        networkValues: {
            display: 'flex',
            height: '6em',
            flexDirection: 'row'
        },
        networkDeposit: {
            marginLeft: '32px',
        },
        flexBreakLine: {
            flexBasis: '100%',
            height: 0,
        },
        contentTypeTabs: {
            marginTop: '26px'
        }
    }),
);

interface Props {
    idea: IdeaDto
    setContentType: (type: IdeaContentType) => void
}

const IdeaHeader: React.FC<Props> = ({idea, setContentType}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()


    const [submitProposalVisibility, setSubmitProposalVisibility] = useState(false);

    const navigateToList = () => {
        history.push(ROUTE_IDEAS)
    }

    const statusLabel = 'Active'
    const statusColor = '#00BFFF'

    return <div className={classes.headerContainer}>
        <IconButton className={classes.closeIcon} svg={CrossSvg} onClick={navigateToList}/>

        <div className={classes.basicInfo}>
            <p className={classes.ideaId}>
                {idea.id}
            </p>
            <Divider className={classes.basicInfoDivider} orientation="vertical"/>
            <div className={classes.status}>
                <Status label={statusLabel} color={statusColor}/>
            </div>
            <div className={classes.ideaTitle}>
                <Header>
                    {idea.title}
                </Header>
            </div>
        </div>
        <div className={classes.networkValues}>
            <Amount amount={1950.000} currency={'DOT'} label={t('idea.content.info.reward')}/>
            <div className={classes.networkDeposit}>
                <Amount amount={1950.000} currency={'DOT'} label={t('idea.content.info.deposit')}/>
            </div>
        </div>
        <div className={classes.flexBreakLine}/>
        <div className={classes.contentTypeTabs}>
            <IdeaContentTypeTabs onChange={(type) => setContentType(type)}/>
        </div>
        {!!idea.id && <Button
            variant="contained"
            color="primary"
            onClick={() => setSubmitProposalVisibility(true)}>
            {t('idea.form.submitProposal')}
        </Button>
        }
        <SubmitProposalModal
            open={submitProposalVisibility}
            onClose={() => setSubmitProposalVisibility(false)}
            idea={idea}/>
    </div>
}

export default IdeaHeader
