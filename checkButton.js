// Button at the bottom that initially reads "Check"
// and then "Next". In "Check" mode, 
// it reveals both the choiceButtons and workInfo.
// In "Next" mode, it resets them instead.
export class CheckButton {
    constructor(buttonElement, audioElem, workInfo, choiceButtons, fetcher) {
        this.buttonElement = buttonElement
        this._mode = 'Check'
        this.buttonElement.addEventListener('click', async () => {
            if (choiceButtons.selectedComposer == null) {
                return
            }
            if (this._mode == 'Check') {
                workInfo.reveal()
                choiceButtons.reveal()
                this.mode = 'Next'
            }
            else if (this._mode == 'Next') {
                this.mode = 'Loading...'
                const [previewUrl, entireUrl, workTitle, correct, decoys] = await fetcher.fetch() // FIXME
                audioElem.src = previewUrl
                workInfo.reset(workTitle, entireUrl, correct)
                choiceButtons.reset(correct, decoys)
                this.mode = 'Check'
            }
        })
    }

    set mode(newMode) {
        this._mode = newMode
        this.buttonElement.innerText = newMode
    }
}
