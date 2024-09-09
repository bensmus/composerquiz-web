// Information about the musical work:
// The title and the composer UI text.
export class WorkInfo {
    constructor(workTextElem, composerTextElem, workText, entireUrl, composerText) {
        this.workTextElem = workTextElem
        this.composerTextElem = composerTextElem
        this.entireUrl = entireUrl
        this.reset(workText, entireUrl, composerText)
    }

    reset(workText, entireUrl, composerText) {
        this.workText = workText
        this.entireUrl = entireUrl
        this.composerText = composerText
        this.workTextElem.innerHTML = '?'
        this.composerTextElem.innerText = 'Composed by ?'
    }

    reveal() {
        this.workTextElem.innerHTML = `<a target="_blank" rel="noopener noreferrer" href=${this.entireUrl}>${this.workText}</a>`
        this.composerTextElem.innerText = `Composed by ${this.composerText}`
    }
}
