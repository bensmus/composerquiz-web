import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

import { ChoiceButtons } from './choiceButtons'
import { WorkInfo } from './workInfo'
import { CheckButton } from './checkButton'
import { Fetcher } from './fetcher'

const fetcher = new Fetcher()

document.addEventListener('DOMContentLoaded', async () => {
    const [audioUrl, workTitle, correct, decoys] = await fetcher.fetch()

    const audioElem = document.querySelector('#audio')
    audioElem.src = audioUrl

    const workInfo = new WorkInfo(
        document.querySelector('#work-text'),
        document.querySelector('#composer-text'),
        workTitle,
        correct
    )

    const choiceButtons = new ChoiceButtons(
        document.querySelector('#choice-buttons'), 
        correct,
        decoys
    )

    new CheckButton(
        document.querySelector('#check-button'),
        audioElem,
        workInfo, 
        choiceButtons,
        fetcher
    );
})
