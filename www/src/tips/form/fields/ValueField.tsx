import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import NetworkValueInput from '../../../components/form/input/networkValue/NetworkValueInput'
import { useNetworks } from '../../../networks/useNetworks'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {}

export type ValueFieldProps = OwnProps

const ValueField = ({}: ValueFieldProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    return (
        <NetworkValueInput
            className={classes.root}
            readonly={false}
            inputName={'value'}
            label={t('tip.form.fields.value')}
            networkId={network.id}
        />
    )
}
export default ValueField
