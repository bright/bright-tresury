import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

export const useCardStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            transform: 'scale(1.01)'
        },
        transition: 'transform 0.2s',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    }
}))