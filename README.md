# Letter Generator 

> This repository contains the source code for Letters Generation (plain text or PDF) from templates  

## Installation

You can install this tools via `yarn`:  

```sh
yarn add letter-generator
```

## Usage  

### 1 - Create a template

You can use a template to generate your text with variables and flags 

```js
// The text contains the static text, flags and variables
// The variables should follow this form: {variable_name}
// The flags should follow this form: [flag_name>The text contained in the flag]
// In addition to your manually defined flags, for each variable var_name, a flag has:var_name will be added
// automatically and set to whether the variable is set and non-empty.
const templateText = "Here is a wonderful template.[flag_1> I don't want this to be printed out.][has:webpage>\nCheck out the {webpage} website!]\n[flag_2>I want this to be printed out.]";

// You should map the flag_name used in the template text with their visibilities (Boolean)
const flags = { flag_1: false, flag_2: true };

// You should map the variable_name used in the template text with their values
const variables = { webpage: 'Datenanfragen.de' };

// Create the template from our values and generate the output text as string
const template = new Template(templateText, flags, variables);
console.log(template.getText());
// Here is a wonderful template.
// Check out the Datenanfragen.de website!
// I want this to be printed out.
```

### 2 - Creating a Letter

You'll have to pass an object to the letter constructor containing those informations:  

```js
const props = {
    // The sender address, either as a string or as an array of the individual lines.
    sender_address: ['Jane Doe', '123 Some Lane', '12345 Some City', 'Some Country'],

    // The recipient address, individual or array
    recipient_address: ['John Doe', '667 One Street', '98765 Another City', 'A Country'],  

    // The information block usually displayed at the top-right of the letter. Can either be a string, a string[] or anything recognized by pdfmake.
    information_block: 'A block of information',

    // The Letter subject
    // In this case we use the text generated with the template but you can use a string
    subject: content,

    // The content of the letter. Can either be a string or anything recognized by pdfmake.
    content: 'Content of my letter',

    // OPTIONAL
    // The signature to be included after the content.
    signature: { type: 'text', name: 'Name' } // To just add the name
        //{ type: 'image', name: 'Name', value: '<BASE64 ENCODED IMAGE>'} to include an image with the name underneath
}
```

### 3 - Rendering the Letter

You can now create the letter object and use it:  
The default layout is the [DIN 5008-a](https://en.wikipedia.org/wiki/DIN_5008) layout  

```js
// Use default layout
const letter = new Letter(props);

// You can also give the letter a function that returns a pdfmake layout as second parameter:
const letter_with_layout = new Letter(props, layout_function);
```

Once your Letter is generated you can create a PdfRender from it:

```js
const render = new PdfRenderer(letter);
render.triggerOpenInNewWindow();
render.triggerDownload();
```

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.  

We warmly welcome issues and pull requests through GitHub.  

Please be aware that by contributing, you agree for your work to be released under the MIT license, as specified in the LICENSE file.  

If you are interested in contributing in other ways besides coding, we can also really use your help. Have a look at [our contribute page](https://datarequests.org/contribute) for more details.  
