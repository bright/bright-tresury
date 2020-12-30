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
            background: theme.palette.background.default,
            padding: '2em 7em 2em 3em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 3em 1em 1.5em'
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        closeIcon: {
            position: 'absolute',
            top: 32,
            right: 32,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                top: 20,
                right: 24
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                top: 26,
                right: 8,
            }
        },
        basicInfo: {
            order: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        basicInfoDivider: {
            height: '20px',
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em'
            }
        },
        status: {
            marginLeft: '2em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '1em'
            },
        },
        ideaTitle: {
            flexBasis: '100%'
        },
        ideaId: {
            fontSize: '18px',
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        networkValues: {
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-start',
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
                marginTop: '16px',
                justifyContent: 'center',
                width: '100%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2
            }
        },
        networkReward: {
            flex: 1
        },
        networkDeposit: {
            flex: 1,
            marginLeft: '32px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginLeft: '18px'
            },
        },
        flexBreakLine: {
            flexBasis: '100%',
            height: 0,
            order: 3
        },
        contentTypeTabs: {
            marginTop: '20px',
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            },
        },
        convertToProposal: {
            order: 5,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                alignSelf: 'flex-end'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'none'
            }
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
            <div className={classes.networkReward}>
                <Amount amount={1950.0000} currency={'DOT'} label={t('idea.content.info.reward')}/>
            </div>
            <div className={classes.networkDeposit}>
                <Amount amount={1950.0000} currency={'DOT'} label={t('idea.content.info.deposit')}/>
            </div>
        </div>
        <div className={classes.flexBreakLine}/>
        <div className={classes.contentTypeTabs}>
            <IdeaContentTypeTabs onChange={(type) => setContentType(type)}/>
        </div>
        {!!idea.id && <div className={classes.convertToProposal}><Button
            variant="contained"
            color="primary"
            onClick={() => setSubmitProposalVisibility(true)}>
            {t('idea.details.header.convertToProposal')}
        </Button></div>
        }
        <SubmitProposalModal
            open={submitProposalVisibility}
            onClose={() => setSubmitProposalVisibility(false)}
            idea={idea}/>
    </div>
}

export default IdeaHeader