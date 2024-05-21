// Button at the bottom that initially reads "Check"
// and then "Try again". In "Check" mode, 
// it reveals both the choiceButtons and workInfo.
// In "Try again" mode, it resets them instead.
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
                this.mode = 'Try again'
            }
            else if (this._mode == 'Try again') {
                this.mode = 'Loading...'
                const [audioUrl, workTitle, correct, decoys] = await fetcher.fetch()
                audioElem.src = audioUrl
                workInfo.reset(workTitle, correct)
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
