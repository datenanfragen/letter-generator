# Letter Generator for datenanfragen .de

> This repository contains the source code for Letters Generation (plain text or PDF) from templates  

## Installation

You can install this tools via npm:  

```sh
npm i letter-generator
```

## Usage  

You'll have to pass an object to the letter constructor containing those informations:  

```js
var props = {
    sender_address: // string | string[]  
        // The sender address, individual or array

    recipient_address: // string | string[]  
        // The recipient address, individual or array

    information_block: // string | string[] | Object  
        // The information block usually displayed at the top-right of the letter. Can either be a string or anything recognized by pdfmake.

    subject: // string
        // The letter subject

    content: // string | string[] | Object
        // The content of the letter. Can either be a string or anything recognized by pdfmake.

    // OPTIONAL
    signature: /* Object --
    { type: 'text', name: 'Name' } // To just add the name
    { type: 'image', name: 'Name', value: '<BASE64 ENCODED IMAGE>'} to include an image with the name underneath
    */
        // The signature to be included after the content.
}
```

You can now create the letter object and use it:  

```js
var letter = new Letter(props);
// You can also give the letter a function that returns a pdfmake layout as second parameter:
var letterWithLayout = new Letter(props, layout_function);
```

Once your Letter is generated you can create a PdfRender from it:

```js
var render = new PdfRenderer(letter);
render.triggerOpenInNewWindow();
render.triggerDownload();
```

## Authors

See the authors [here](./AUTHORS)

## Dependencies

This package has dependencies on only on package and you can see the informations [here](./ATTRIBUTION)
