import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Formik} from "formik";
import React, {createRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from "../../components/button/Button";
import {FormSelect} from "../../components/select/FormSelect";
import {ISelect} from "../../components/select/Select";
import {Account, InputParam, TxAttrs} from './SubmittingTransaction';
import config from '../../config';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
        networkTitle: {
            textAlign: 'center'
        },
        buttons: {
            marginTop: 42,
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
        }
    }),
);

interface Props {
    txAttrs: TxAttrs
    onCancel: () => void
    onSubmit: (address: string) => void
    accounts: Account[]
}

interface Values {
    account: Account
}

const TypedSelect = FormSelect as ISelect<Account>

const SignAndSubmitForm: React.FC<Props> = ({txAttrs, onCancel, onSubmit, accounts}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const emptyAccount = {
        name: t('substrate.create.selectAccount'),
        address: ''
    } as Account

    const allParamsFilled = () => {
        const {palletRpc, callable, inputParams} = txAttrs;
        if (!palletRpc || !callable) {
            return false
        }

        if (inputParams === undefined || inputParams.length === 0) {
            return true
        }

        return inputParams.every((param: InputParam) => {
            if (param.optional) {
                return true;
            }
            if (param.value === null || param.value === undefined) {
                return false;
            }

            const value = typeof param === 'object' ? param.value : param;
            return value !== null && value !== '' && value !== undefined;
        });
    };

    const onSubmitForm = (values: Values) => {
        onSubmit(values.account.address)
    }

    const contextRef = createRef<HTMLDivElement>();

    return (
        <div ref={contextRef} className={classes.root}>
            {accounts.length === 0 || accounts.length === 1 ? <p>No accounts available</p> :
                <Formik
                    initialValues={{
                        account: emptyAccount,
                    } as Values}
                    onSubmit={onSubmitForm}>
                    {({
                          values,
                          handleSubmit
                      }) =>
                        <div>
                            <p className={classes.networkTitle}>{t('substrate.form.networkHeader')}</p>
                            <p className={classes.networkTitle}>{config.NETWORK_NAME}</p>
                            <form autoComplete="off" onSubmit={handleSubmit}>
                                <TypedSelect
                                    variant={"outlined"}
                                    name="account"
                                    label={t('substrate.create.selectAccount')}
                                    options={[emptyAccount, ...accounts]}
                                    value={values.account}
                                    renderOption={(value: Account) => {
                                        return value.name ?? value.address
                                    }}
                                />
                                <div className={classes.buttons}>
                                    <Button variant={"text"} color="primary" type="button" onClick={onCancel}>
                                        {t('substrate.create.cancel')}
                                    </Button>
                                    <Button
                                        color='primary'
                                        type='submit'
                                        disabled={!allParamsFilled() || !values.account.address}
                                    >
                                        {t('substrate.create.signAndSubmit')}
                                    </Button>
                                </div>
                            </form>
                        </div>}
                </Formik>}
        </div>
    );
}

export default SignAndSubmitForm
