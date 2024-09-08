import './style.css'

import { ChoiceButtons } from './choiceButtons'
import { WorkInfo } from './workInfo'
import { CheckButton } from './checkButton'
import { Fetcher } from './fetcher'

const fetcher = new Fetcher()

document.addEventListener('DOMContentLoaded', async () => {
    const [previewUrl, entireUrl, workTitle, correct, decoys] = await fetcher.fetch() // FIXME

    const audioElem = document.querySelector('#audio')
    audioElem.src = previewUrl

    const workInfo = new WorkInfo(
        document.querySelector('#work-text'),
        document.querySelector('#composer-text'),
        workTitle,
        entireUrl,
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
