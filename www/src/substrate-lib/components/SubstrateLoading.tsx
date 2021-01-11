import {Box, createStyles} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from 'react';
import {useTranslation} from "react-i18next";
import {Button} from "../../components/button/Button";

const useStyles = makeStyles(() =>
    createStyles({
        linearProgress: {
            width: '100%',
            margin: '60px 0',
        },
    }),
);

export interface Props {
    onOk: () => void
}

const SubstrateLoading: React.FC<Props> = ({onOk}) => {
    const {t} = useTranslation()
    const classes = useStyles()
    return (
        <Box
            display="flex"
            flexDirection='column'
            alignItems='center'
        >
            <h2 id='modal-title'>{t('substrate.loading.title')}</h2>
            <div className={classes.linearProgress}>
                <LinearProgress color='primary'/>
            </div>
            <Box>
                <Button color='primary' variant='text' onClick={onOk}>{t('substrate.loading.cancel')}</Button>
            </Box>
        </Box>
    );
}

export default SubstrateLoading
