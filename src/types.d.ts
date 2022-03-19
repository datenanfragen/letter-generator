import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

export type PdfMakeContent = string | string[] | Content;

/**
 * The signature to be included after the content. If not left blank, this can be:
 *   - `{ type: 'text', name: 'Name' }` to just add the name
 *   - `{ type: 'image', name: 'Name', value: 'base64-encoded image' }` to include an image and the name underneath
 */
export type Signature = { type: 'text'; name: string } | { type: 'image'; name?: string; value: string };

/** A function that returns a pdfmake layout for the given parameters. */
export type LayoutFunction = (
    sender_address: string,
    recipient_address: string,
    information_block?: PdfMakeContent,
    subject: string,
    content: PdfMakeContent,
    signature?: Content | null
) => TDocumentDefinitions;
