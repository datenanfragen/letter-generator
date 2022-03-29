import { mm2pt } from '../utility';
import type { LayoutFunction } from '../types';

/** Generate a pdfmake layout (according to DIN 5008-a) for the given parameters. */
export const layout: LayoutFunction = (
    sender_address,
    recipient_address,
    information_block,
    subject,
    content,
    signature
) => ({
    pageSize: 'A4',
    pageMargins: [mm2pt(25), mm2pt(27), mm2pt(20), mm2pt(16.9)], // [left, top, right, bottom]
    content: [
        {
            columns: [
                {
                    width: mm2pt(85),
                    text: sender_address,
                    fontSize: 6,
                },
            ],
            absolutePosition: { x: mm2pt(25), y: mm2pt(30) },
        },
        {
            columns: [
                {
                    width: mm2pt(85),
                    text: recipient_address,
                },
            ],
            absolutePosition: { x: mm2pt(25), y: mm2pt(35) },
        },
        {
            columns: [
                {
                    width: mm2pt(75),
                    text: information_block || '',
                },
            ],
            absolutePosition: { x: mm2pt(210 - 85), y: mm2pt(32) },
        },
        {
            text: [
                {
                    text: subject + '\n\n\n',
                    bold: true,
                },
                ...(Array.isArray(content) ? content : [content]),
            ],
            marginTop: mm2pt(58),
        },
        signature || '',
    ],
    background: {
        canvas: [
            {
                type: 'line',
                x1: 0,
                y1: mm2pt(87),
                x2: mm2pt(8),
                y2: mm2pt(87),
                lineWidth: 1,
            },
            {
                type: 'line',
                x1: 0,
                y1: mm2pt(192),
                x2: mm2pt(8),
                y2: mm2pt(192),
                lineWidth: 1,
            },
            {
                type: 'line',
                x1: 0,
                y1: mm2pt(148.5),
                x2: mm2pt(10),
                y2: mm2pt(148.5),
                lineWidth: 1,
            },
        ],
    },
});
