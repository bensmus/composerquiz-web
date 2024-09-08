import './style.css'

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
