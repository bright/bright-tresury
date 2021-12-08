import { Time } from '@polkadot/util/types'
import { TFunction } from 'i18next'
import { singularPluralOrNull } from './stringUtil'

export function timeToString({ days, hours, minutes, seconds }: Time, t: TFunction): string {
    return [
        singularPluralOrNull(days, t('common.dateTime.day'), t('common.dateTime.days')),
        singularPluralOrNull(hours, t('common.dateTime.hour'), t('common.dateTime.hours')),
        singularPluralOrNull(minutes, t('common.dateTime.minute'), t('common.dateTime.minutes')),
        singularPluralOrNull(seconds, t('common.dateTime.second'), t('common.dateTime.seconds')),
    ]
        .filter((value): value is string => !!value)
        .slice(0, 2)
        .join(' ')
}

export function dateToString(date: Date): string {
    return date.toLocaleString()
}
