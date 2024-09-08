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
        this.workTextElem.innerText = '?'
        this.composerTextElem.innerHTML = 'Composed by ?'
    }

    reveal() {
        this.workTextElem.innerText = this.workText
        this.composerTextElem.innerHTML = `Composed by <a target="_blank" rel="noopener noreferrer" href=${this.entireUrl}>${this.composerText}</a>`
    }
}
