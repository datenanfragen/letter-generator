import { formatAddress, mm2pt, stripTags } from './utility';

/**
 * The props accepted by `Letter`.
 *
 * @typedef {Object} props
 * @param {string[]|string} props.sender_address The sender address either as a string or an array of the individual
 *     lines of the address.
 * @param {string[]|string} props.recipient_address The recipient address either as a string or an array of the
 *     individual lines of the address.
 * @param {string|string[]|Object} [props.information_block=''] The information block usually displayed at the top-
 *     right of the letter. Can either be a string or anything recognized by pdfmake.
 * @param {string} props.subject
 * @param {string|string[]|Object} props.content The content of the letter. Can either be a string or anything
 *     recognized by pdfmake.
 * @param {Object} [props.signature] The signature to be included after the content. If not left blank, this can be:
 *     - `{ type: 'text', name: 'Name' }` to just add the name
 *     - `{ type: 'image', name: 'Name', value: 'base64-encoded image' }` to include an image and the name underneath
 */

export default class Letter {
    /**
     * @param {props} props
     * @param {Function} layout_function A function that returns a pdfmake layout for the given parameters.
     */
    constructor(props, layout_function = null) {
        this.doc = {};

        this.layout = layout_function || require('./layouts/din-5008-a');
        this.props = {
            sender_address: [],
            recipient_address: [],
            information_block: '',
            subject: '',
            content: '',
            signature: { type: 'text', value: '' }
        };
        this.setProps(props);
    }

    /**
     * Render the letter as a string, used e.g. for emails.
     */
    toString() {
        const information_block = Array.isArray(this.props.information_block)
            ? this.props.information_block.join('\n')
            : this.props.information_block;
        return information_block + '\n\n' + stripTags(this.props.content) + '\n' + this.props.signature['name'];
    }

    /**
     * Change some props.
     *
     * @param {*} props
     * @see {@link Letter#constructor}
     */
    setProps(props) {
        for (let i in props) {
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

    /**
     * Convert a given signature into a format understood by pdfmake.
     * @param {Object} signature
     * @see {@link Letter#constructor}
     */
    static handleSignature(signature) {
        if (!signature) return null;
        switch (signature.type) {
            case 'text':
                return { text: signature.name, marginTop: mm2pt(2) };
            case 'image':
                return [
                    { image: signature.value, width: mm2pt(60), marginTop: mm2pt(5) },
                    { text: signature.name, marginTop: mm2pt(1) }
                ];
            default:
                return null;
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
     *
     * @param {string} content String to parse
     * @return {Array}
     */
    static parseTags(content) {
        if (!content) return [];

        const regex = /<(.+?>)([\S\s]*?)<\/\1/gmu;
        const text_array = content.split(regex);

        let content_array = [];
        text_array.forEach(function(slice, i) {
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
    }
}
