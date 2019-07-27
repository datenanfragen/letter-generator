const pdfMake = require('pdfmake');

export default class PdfRenderer {
    /**
     * @param {Letter} letter
     */
    constructor(letter) {
        this.doc = letter.doc;
    }

    /**
     * Set the fonts used by pdfmake.
     * @see {@link https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/}
     *
     * @param {Object} vfs
     * @param {Object} fonts
     */
    setFonts(vfs, fonts) {
        pdfMake.vfs = vfs;
        pdfMake.fonts = fonts;
    }

    /**
     * Trigger a download of the PDF.
     */
    triggerDownload() {
        pdfMake.createPdf(this.doc).download();
    }

    /**
     * Trigger opening the PDF in a new window or tab.
     */
    triggerOpenInNewWindow() {
        pdfMake.createPdf(this.doc).open();
    }

    /**
     * Trigger opening the print dialog of the PDF.
     */
    triggerPrint() {
        pdfMake.createPdf(this.doc).print();
    }

    /**
     * @returns {Promise<Blob>} A promise that resolves to the PDF blob.
     */
    pdfBlob() {
        return new Promise(resolve => {
            pdfMake.createPdf(this.doc).getBlob(blob => {
                resolve(blob);
            });
        });
    }
}
