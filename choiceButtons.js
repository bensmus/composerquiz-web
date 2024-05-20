// TODO: add a reset method and use it in constructor.

// Buttons to choose a composer.
export class ChoiceButtons {
    constructor(divElement, choices, correct) {
        this.selectedButton = null
        this.choiceButtons = []
        this.correct = correct

        // Spawn all of the buttons and their click handlers:
        for (const choice of choices) {
            const choiceButton = document.createElement('button')
            this.choiceButtons.push(choiceButton)
            divElement.appendChild(choiceButton)
            choiceButton.innerText = choice
            
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

        // Bind the reveal method to the instance
        // this.reveal = this.reveal.bind(this);
    }

    get selectedComposer() {
        if (this.selectedButton != null) {
            return this.selectedButton.innerText
        }
        return null
    }

    reveal() {
        const selected = this.selectedComposer
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
