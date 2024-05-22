// Information about the musical work:
// The title and the composer UI text.
export class WorkInfo {
    constructor(workTextElem, composerTextElem, workText, composerText) {
        this.workTextElem = workTextElem
        this.composerTextElem = composerTextElem
        this.reset(workText, composerText)

        // Bind the reveal method to the instance
        this.reveal = this.reveal.bind(this);
    }

    reset(workText, composerText) {
        this.workText = workText
        this.composerText = composerText
        this.workTextElem.innerText = '?'
        this.composerTextElem.innerText = 'Composed by ?'
    }

    reveal() {
        this.workTextElem.innerText = this.workText
        this.composerTextElem.innerText = `Composed by ${this.composerText}`
    }
}
