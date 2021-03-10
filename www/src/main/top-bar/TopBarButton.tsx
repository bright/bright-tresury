import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';
import {IconButton} from "../../components/button/IconButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '30px',
            width: '30px',
            borderStyle: 'solid',
            borderRadius: '8px',
            borderColor: '#EBEBEB',
            borderWidth: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            padding: '1px',
        }
    }),
);

interface TopBarButtonProps {
    alt: string,
    svg: string,
    onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void
}

const TopBarButton: React.FC<TopBarButtonProps> = ({alt, svg, onClick}) => {
    const classes = useStyles();
    return <div className={classes.root}>
        <IconButton className={classes.image} onClick={onClick} alt={alt} svg={svg}/>
    </div>
}

export default TopBarButton
