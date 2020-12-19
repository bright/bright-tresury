import React, {useContext, useEffect, useState} from "react";
import IdeaDetails, {IdeaDetailsState} from "../details/IdeaDetails";
import IdeaFormHeader from "./IdeaFormHeader";
import {useParams} from "react-router";
import {getIdeaById, IdeaDto, IdeaNetworkDto} from "../ideas.api";
import {Button} from "../../components/button/Button";
import {useTranslation} from "react-i18next";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import SubmitProposalModal from "../SubmitProposalModal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: '3em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        },
    }),
);

interface Props {
    network: string
}

const IdeaForm: React.FC<Props> = ({network}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    let {ideaId} = useParams<{ ideaId: string }>()

    const [submitProposalVisibility, setSubmitProposalVisibility] = React.useState(false);
    const [idea, setIdea] = useState<IdeaDto>({
        title: '',
        beneficiary: '',
        field: '',
        content: '',
        networks: [{name: network, value: 0} as IdeaNetworkDto],
        contact: '',
        portfolio: '',
        links: [],
    })

    useEffect(() => {
        if (ideaId !== undefined) {
            getIdeaById(ideaId).then((result) => {
                setIdea(result)
            }).catch()
        }
    }, [ideaId])

    const isNew = (): boolean => idea.id === undefined

    return <div className={classes.root}>
        <IdeaFormHeader isNewIdea={isNew()}/>
        <IdeaDetails idea={idea} setIdea={setIdea} state={IdeaDetailsState.EDITABLE}/>
        {!!idea.id && <Button
            variant="contained"
            color="primary"
            onClick={() => setSubmitProposalVisibility(true)}>
            {t('idea.details.submitProposal')}
        </Button>}
        <SubmitProposalModal
            open={submitProposalVisibility}
            onClose={() => setSubmitProposalVisibility(false)}
            idea={idea}/>
    </div>
}

export default IdeaForm
