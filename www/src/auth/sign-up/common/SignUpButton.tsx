import {Button, ButtonProps} from "../../../components/button/Button";
import {ButtonsContainer} from "../../../components/form/buttons/ButtonsContainer";
import React from "react";
import {useTranslation} from "react-i18next";

export const SignUpButton = (props: ButtonProps) => {
    const {t} = useTranslation()

    return <ButtonsContainer>
        <Button
            {...props}
            variant="contained"
            color="primary"
            type='submit'>
            {t('auth.signUp.submitButton')}
        </Button>
    </ButtonsContainer>
}
