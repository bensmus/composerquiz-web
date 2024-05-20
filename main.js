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

const choiceButtons = new ChoiceButtons(
    document.querySelector('#choice-buttons'), 
    ['Chopin', 'Bach', 'Sibelius', 'Rameau'],
    'Sibelius'
)

const workInfo = new WorkInfo(
    document.querySelector('#work-text'),
    document.querySelector('#composer-text'),
    'Thing in F major',
    'Sibelius'
)

// TODO: this should be a class of its own with an inner state and 
// should take choiceButtons and workInfo as parameters
const checkButton = document.querySelector('#check-button')

checkButton.addEventListener('click', () => {
    if (choiceButtons.selectedComposer != null) {
        workInfo.reveal(); choiceButtons.reveal()
        checkButton.innerText = 'Try again'
    }
})
