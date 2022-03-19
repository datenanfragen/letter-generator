import pdfMake from 'pdfmake/build/pdfmake';
import type { vfs as _vfs, fonts as _fonts } from 'pdfmake/build/pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Letter } from './Letter';

export class PdfRenderer {
    doc: TDocumentDefinitions;

    constructor(letter: Letter) {
        this.doc = letter.doc;
    }

    /**
     * Set the fonts used by pdfmake.
     * @see {@link https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/}
     */
    setFonts(vfs: typeof _vfs, fonts: typeof _fonts) {
        pdfMake.vfs = vfs;
        pdfMake.fonts = fonts;
    }

    triggerDownload() {
        pdfMake.createPdf(this.doc).download();
    }

    triggerOpenInNewWindow() {
        pdfMake.createPdf(this.doc).open();
    }

    triggerPrint() {
        pdfMake.createPdf(this.doc).print();
    }

    pdfBlob(): Promise<Blob> {
        return new Promise((resolve) => {
            pdfMake.createPdf(this.doc).getBlob((blob) => {
                resolve(blob);
            });
        });
    }
}
