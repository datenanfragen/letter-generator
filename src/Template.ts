export class Template {
    template: string;
    flags: Record<string, boolean>;
    variables: Record<string, string>;

    /**
     * @param template The template to use. The template may contain:
     *     - Flags: `[flag_name>Some text here.]`
     *       `Some text here.` will only be included in the result if the `flag_name` flag is set to `true.
     *     - Variables: `{var_name}`
     *       This will be replaced by the value of the variable `var_name`.
     * @param flags An object that maps the flags in the template to a boolean, e.g.:
     *     `{flag1: true, flag2: false}`
     * @param variables An object that variables in the template to their value, e.g.:
     *      `{var1: 'Johnny', var2: 'Hello world.'}`
     */
    constructor(template: string, flags: Record<string, boolean>, variables: Record<string, string>) {
        [this.template, this.flags, this.variables] = [template, flags, variables];
    }

    /**
     * @returns The 'handled' version of the template, with all variables replaced and flag text either included or
     *     hidden.
     */
    getText(): string {
        let result = this.template;
        for (const flag in this.flags) {
            result = result.replace(new RegExp('\\[' + flag + '>([\\s\\S]*?)\\]', 'gmu'), this.flags[flag] ? '$1' : '');
        }
        for (const variable in this.variables) {
            result = result.replace('{' + variable + '}', this.variables[variable]);
        }
        return result;
    }
}
