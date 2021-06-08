import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import common_en from './translation/en/common.json'
import { DEFAULT_LANGUAGE } from './translation/translationStorage'

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

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
