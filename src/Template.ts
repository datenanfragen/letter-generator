import { matchAll } from './utility';

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
     *
     *     Unless overridden, for each variable `var_name`, a flag `has:var_name` will be added automatically and set to
     *     whether the variable is set and non-empty.
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

        const replace_flag = (text: string, flag_name: string, flag_value: boolean) =>
            text.replace(new RegExp('\\[' + flag_name + '>([\\s\\S]*?)\\]', 'gmu'), flag_value ? '$1' : '');
        // Replace the "regular" flags set by the user.
        for (const flag in this.flags) {
            result = replace_flag(result, flag, this.flags[flag]);
        }
        // Replace the automatically generated `has:var_name` flags. As these are handled after the regular flags, this
        // will not override any user-defined flags of the same name.
        for (const [, has_flag_name, var_name_to_check] of matchAll(/\[(has:(.+?))>[\s\S]*?\]/gmu, result)) {
            result = replace_flag(
                result,
                has_flag_name,
                !!this.variables[var_name_to_check] && this.variables[var_name_to_check] !== ''
            );
        }

        // Replace the variables set by the user.
        for (const variable in this.variables) {
            result = result.replace(new RegExp('{' + variable + '}', 'g'), this.variables[variable]);
        }

        return result;
    }
}
