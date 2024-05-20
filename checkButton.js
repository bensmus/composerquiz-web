// Button at the bottom that initially reads "Check"
// and then "Try again". In "Check" mode, 
// it reveals both the choiceButtons and workInfo.
// In "Try again" mode, it resets them instead.
export class CheckButton {
    constructor(buttonElement, workInfo, choiceButtons) {
        this.buttonElement = buttonElement
        this._mode = 'Check'
        this.buttonElement.addEventListener('click', () => {
            if (choiceButtons.selectedComposer == null) {
                return
            }
            if (this._mode == 'Check') {
                workInfo.reveal()
                choiceButtons.reveal()
                this.mode = 'Try again'
            }
            else if (this._mode == 'Try again') {
                workInfo.reset('Apple in Sky major', 'Skydaddy')
                choiceButtons.reset(['Watterdaddy', 'Earthmommy', 'Mudsister', 'Skydaddy'], 'Skydaddy')
                this.mode = 'Check'
            }
        })
    }

    set mode(newMode) {
        this._mode = newMode
        this.buttonElement.innerText = newMode
    }
}
