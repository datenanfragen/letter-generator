import type { PdfMakeContent } from './types';

/** Converts values from millimeters to PDF points. */
export const mm2pt = (mm: number): number => (72.0 / 25.4) * mm;

/** Generates a formatted address string.*/
export const formatAddress = (address: string | string[], delimiter = '\n'): string =>
    address ? (Array.isArray(address) ? address.filter((item) => item).join(delimiter) : address) : '';

/** Generates a random reference for correspondence in the given year. */
export const generateReference = (date: Date): string =>
    date.getFullYear() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();

// TODO: This can only handle pdfmake content with `{text: <content>}`. Anything else is not changed.
export const applyFunctionToPdfMakeContent = (
    content: PdfMakeContent | undefined,
    func: (text: string) => PdfMakeContent
): PdfMakeContent => {
    if (!content) return '';
    if (typeof content === 'string') return func(content);
    if ('text' in content) return { ...content, text: applyFunctionToPdfMakeContent(content.text, func) };
    if (Array.isArray(content)) return content.map((t) => stripTags(t));
    return content;
};

const _stripTags = (text: string) => text.replace(/<.+?>/gmu, '');
/**
 * Strip tags (<tag>) from the given text.
 *
 * TODO: We don't know how to strip tags in arbitrary pdfmake content (we only handle top-level `text` properties) but
 *       that doesn't matter too much since the tag stripping is only for aesthetic purposes and not for security.
 */
export const stripTags = (text: PdfMakeContent): PdfMakeContent => applyFunctionToPdfMakeContent(text, _stripTags);

/**
 * Polyfill for `String.prototype.matchAll()`.
 *
 * Adapted after: https://stackoverflow.com/a/67807955 and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#finding_successive_matches
 */
export const matchAll = (re: RegExp, str: string): RegExpExecArray[] => {
    let match;
    const matches = [];

    while ((match = re.exec(str)) !== null) matches.push(match);

    return matches;
};
