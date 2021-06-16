import i18next from 'i18next'
import React from 'react'
import { initReactI18next } from 'react-i18next'
import ThemeWrapper from '../src/theme/ThemeWrapper'
import common_en from '../src/translation/en/common.json'
import { DEFAULT_LANGUAGE } from '../src/translation/translationStorage'

i18next
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: common_en,
            },
        },
        lng: DEFAULT_LANGUAGE,
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    })
    .then()

export const decorators = [
    (Story) => (
        <ThemeWrapper>
            <Story />
        </ThemeWrapper>
    ),
]
