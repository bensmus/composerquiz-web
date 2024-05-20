// Buttons to choose a composer.
export class ChoiceButtons {
    constructor(divElement, choices, correct) {
        this.choiceButtons = []

        // Spawn all of the buttons and their click handlers:
        for (const choice of choices) {
            const choiceButton = document.createElement('button')
            this.choiceButtons.push(choiceButton)
            divElement.appendChild(choiceButton)
            
            // Unchoose the previous selectedButton, set selectedButton to choiceButton.
            const setselectedButton = () => {
                if (this.selectedButton != null) {
                    this.selectedButton.classList.remove('blue-background')
                }
                this.selectedButton = choiceButton
                this.selectedButton.classList.add('blue-background')
            }

            choiceButton.addEventListener('click', setselectedButton)
        }

        this.reset(choices, correct)
    }

    reset(choices, correct) {
        this.selectedButton = null
        this.correct = correct

        // Spawn all of the buttons and their click handlers:
        for (const [i, choice] of choices.entries()) {
            const choiceButton = this.choiceButtons[i]
            choiceButton.innerText = choice
            choiceButton.disabled = false
            choiceButton.classList.remove('green-background')
            choiceButton.classList.remove('red-background')
        }
    }

    get selectedComposer() {
        if (this.selectedButton != null) {
            return this.selectedButton.innerText
        }
        return null
    }

    reveal() {
        const selected = this.selectedComposer
        this.selectedButton.classList.remove('blue-background')
        for (const choiceButton of this.choiceButtons) {
            choiceButton.disabled = true
        }
        if (selected == this.correct) {
            this.selectedButton.classList.add('green-background')
        } else {
            this.selectedButton.classList.add('red-background')
        }
    }
}
