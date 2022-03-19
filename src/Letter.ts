import type { TDocumentDefinitions, ContentText, ContentImage, Content } from 'pdfmake/interfaces';
import { layout as dinLayoutFunction } from './layouts/din-5008-a';
import { formatAddress, mm2pt, stripTags, applyFunctionToPdfMakeContent } from './utility';
import type { LayoutFunction, PdfMakeContent, Signature } from './types';

type LetterProps = {
    sender_address: string[] | string;
    recipient_address: string[] | string;
    /** The information block usually displayed at the top-right of the letter. */
    information_block?: PdfMakeContent;
    subject: string;
    content: PdfMakeContent;
    signature: Signature;
};
// The `marginTop` is missing in the type definitions.
type PdfMakeSignature = (ContentText | ContentImage) & { marginTop: number };

const _parseTags = (content: string) => {
    if (!content) return [];

    const regex = /<(.+?>)([\S\s]*?)<\/\1/gmu;
    const text_array = content.split(regex);

    const content_array: Content[] = [];
    text_array.forEach(function (slice, i) {
        switch (slice) {
            case 'bold>':
                content_array.push({ text: text_array[i + 1], bold: true });
                delete text_array[i + 1];
                break;
            case 'italic>':
                content_array.push({ text: text_array[i + 1], italics: true });
                delete text_array[i + 1];
                break;
            case '':
                break;
            default:
                content_array.push(slice);
        }
    });

    return content_array;
};

export class Letter {
    doc: TDocumentDefinitions;
    layout: LayoutFunction;
    props: LetterProps;

    constructor(props: LetterProps, layout_function?: LayoutFunction) {
        this.doc = { content: '' };

        this.layout = layout_function || dinLayoutFunction;
        this.props = {
            sender_address: [],
            recipient_address: [],
            information_block: '',
            subject: '',
            content: '',
            signature: { type: 'text', name: '' },
        };
        this.setProps(props);
    }

    /** Render the letter as a string, used e.g. for emails. */
    toString() {
        const information_block = Array.isArray(this.props.information_block)
            ? this.props.information_block.join('\n')
            : this.props.information_block;
        return information_block + '\n\n' + stripTags(this.props.content) + '\n' + this.props.signature['name'];
    }

    setProps(props: LetterProps) {
        for (const i in props) {
            // This is obviously fine but TypeScript isn't smart enough to figure that and I'm too lazy to teach it. :D
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (Object.prototype.hasOwnProperty.call(this.props, i)) this.props[i] = props[i];
        }

        this.doc = this.layout(
            formatAddress(this.props.sender_address, ' • '),
            formatAddress(this.props.recipient_address),
            this.props.information_block,
            this.props.subject,
            Letter.parseTags(this.props.content),
            Letter.handleSignature(this.props.signature)
        );
    }

    /** Convert a given signature into a format understood by pdfmake. */
    static handleSignature(signature: Signature): PdfMakeSignature | PdfMakeSignature[] | null {
        if (!signature) return null;
        switch (signature.type) {
            case 'text':
                return { text: signature.name, marginTop: mm2pt(2) };
            case 'image':
                return [
                    { image: signature.value, marginTop: mm2pt(5) },
                    ...(signature.name ? [{ text: signature.name, marginTop: mm2pt(1) }] : []),
                ];
        }
    }

    /**
     * Convert a string with (potential) tags into a format understood by pdfmake.
     *
     * The following tags are supported:
     *   - <bold>This text will be bold.</bold>
     *   - <italic>This text will be italic.</italic>
     *
     * Nesting tags is not supported.
     */
    static parseTags(content: PdfMakeContent): PdfMakeContent {
        return applyFunctionToPdfMakeContent(content, _parseTags);
    }
}
