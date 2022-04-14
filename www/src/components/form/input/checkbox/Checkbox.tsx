import MaterialCheckbox, { CheckboxProps as MaterialCheckboxProps } from '@material-ui/core/Checkbox'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import checkboxCheckedIcon from '../../../../assets/checkbox_checked.svg'
import checkboxIcon from '../../../../assets/checkbox_empty.svg'
import checkboxOutlinedIcon from '../../../../assets/tick_inactive.svg'
import checkboxOutlinedCheckedIcon from '../../../../assets/tick_active.svg'

export type CheckboxVariant = 'outlined' | 'simple'

interface OwnProps {
    variant?: CheckboxVariant
}

export type CheckboxProps = OwnProps & MaterialCheckboxProps

export const Checkbox = ({ variant = 'simple', ...props }: CheckboxProps) => {
    const { t } = useTranslation()

    const icon = useMemo(() => {
        switch (variant) {
            case 'outlined':
                return checkboxOutlinedIcon
            case 'simple':
                return checkboxIcon
        }
    }, [variant])

    const checkedIcon = useMemo(() => {
        switch (variant) {
            case 'outlined':
                return checkboxOutlinedCheckedIcon
            case 'simple':
                return checkboxCheckedIcon
        }
    }, [variant])

    return (
        <MaterialCheckbox
            icon={<img src={icon} alt={t('form.inputs.checkbox.notChecked')} />}
            checkedIcon={<img src={checkedIcon} alt={t('form.inputs.checkbox.checked')} />}
            disableRipple={true}
            {...props}
        />
    )
}

export default Checkbox
