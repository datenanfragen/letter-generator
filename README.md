## Generate letters from templates
Use this tool : 
```bash
$ npm i letter-generator
```
This tool can generate letters as plain text or pdf ( by pdfmake) from a template.

Template contains the following props :
*Sender Address* The sender address either as a string or an array of the individual lines of the address.

*Recipient Address* The recipient address either as a string or an array of the individual lines of the address.
 
*Information Block* The information block usually displayed at the top-right of the letter. Can either be a string or anything recognized by pdfmake.

*Subject* Subject of your letter.

*Content* The content of the letter. Can either be a string or anything recognized by pdfmake.

*Signature* The signature to be included after the content. If not left blank, this can be:

      - `{ type: 'text', name: 'Name' }` to just add the name
      
      - `{ type: 'image', name: 'Name', value: 'base64-encoded image' }` to include an image and the name underneath
