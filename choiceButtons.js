import { sample } from './util';

// Buttons to choose a composer.
export class ChoiceButtons {
    static shuffleCorrectAndDecoys(correct, decoys) {
        return sample([correct, ...decoys], decoys.length + 1);
    }

    constructor(divElement, correct, decoys) {
        this.choiceButtons = Array.from(divElement.children);

        // Attach click handlers:
        for (let i = 0; i < decoys.length + 1; i++) {
            const choiceButton = this.choiceButtons[i];

            // Unchoose the previous selectedButton, set selectedButton to choiceButton.
            const setselectedButton = () => {
                if (this.selectedButton != null) {
                    this.selectedButton.classList.remove('blue-background');
                }
                this.selectedButton = choiceButton;
                this.selectedButton.classList.add('blue-background');
            };

            choiceButton.addEventListener('click', setselectedButton);
        }

        this.reset(correct, decoys);
    }

    reset(correct, decoys) {
        this.selectedButton = null;
        this.correct = correct;
        const choices = ChoiceButtons.shuffleCorrectAndDecoys(correct, decoys);

        // Spawn all of the buttons and their click handlers:
        for (const [i, choice] of choices.entries()) {
            const choiceButton = this.choiceButtons[i];
            choiceButton.innerText = choice;
            choiceButton.disabled = false;
            choiceButton.classList.remove('green-background');
            choiceButton.classList.remove('red-background');
        }
    }

    get selectedComposer() {
        if (this.selectedButton != null) {
            return this.selectedButton.innerText;
        }
        return null;
    }

    reveal() {
        const selected = this.selectedComposer;
        this.selectedButton.classList.remove('blue-background');
        for (const choiceButton of this.choiceButtons) {
            choiceButton.disabled = true;
        }
        if (selected == this.correct) {
            this.selectedButton.classList.add('green-background');
        } else {
            this.selectedButton.classList.add('red-background');
        }
    }
}
