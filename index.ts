/**
 * Parses a string into a class.
 * Can be called either as a normal function or tagged template literal.
 */
export default function classify(strings: string | TemplateStringsArray, ...values: string[]) {
    const code = (typeof strings === "string" ? strings : strings.map((s, i) => s + (values[i] || "")).join(""))
        .split("\n")
        .map((l) => l.trimEnd())
        .filter((l) => l);

    if (!/^[a-zA-Z$_][a-zA-Z0-9$_]*\s+\[([a-zA-Z$_][a-zA-Z0-9$_ ]*)?\]$/.test(code[0]))
        throw new Error("First line must be the constructor.");

    const constructorHeader = code.shift();

    if (!constructorHeader) throw new Error("Assertion failed: 'constructorHeader' is undefined.");

    const className = constructorHeader.split("[")[0].trim();

    const constructorParams =
        constructorHeader
            .match(/\[(.*)\]/)?.[1]
            .trim()
            .split(/\s+/) || [];

    const index = code.findIndex((l) => !/^\s+/.test(l));

    const constructor = code
        .splice(0, index < 0 ? code.length : index)
        .map((l) => l.trim())
        .join("\n");

    let methods = "";

    let properties = "";

    while (code.length)
        if (/^(\+)?(=)?[a-zA-Z$_][a-zA-Z0-9$_]*\s+\[([a-zA-Z$_][a-zA-Z0-9$_ ]*)?\]$/.test(code[0])) {
            const methodHeader = code.shift();

            if (!methodHeader) throw new Error("Assertion failed: 'methodHeader' is undefined.");

            const methodName = methodHeader.split("[")[0].trim();

            const methodParams = methodHeader
                .match(/\[(.*)\]/)?.[1]
                .trim()
                .split(/\s+/);

            const index = code.findIndex((l) => !/^\s+/.test(l));

            const method = code
                .splice(0, index < 0 ? code.length : index)
                .map((l) => l.trim())
                .join("\n");

            methods += `${
                methodName.startsWith("+")
                    ? `static ${methodName.slice(1).startsWith("=") ? `async ${methodName.slice(2)}` : methodName.slice(1)}`
                    : methodName.startsWith("=")
                    ? `async ${methodName.slice(1)}`
                    : methodName
            } (${methodParams}) {
                ${method}
            }\n\n`;
        } else if (/^\+?[a-zA-Z$_][a-zA-Z0-9$_]*\s+=\s+.+/.test(code[0])) {
            const propHeader = code.shift();

            if (!propHeader) throw new Error("Assertion failed: 'propHeader' is undefined.");

            const propName = propHeader.split("=")[0].trim();

            properties += `${propName.startsWith("+") ? `static ${propName.slice(1)}` : propName} = ${propHeader
                .split("=")[1]
                .trim()}\n\n`;
        } else code.splice(0, 1);

    return new Function(`
        return class ${className} {
            constructor (${constructorParams.join(", ")}) {
                ${constructor}
            }

            ${properties}

            ${methods}
        }
    `)();
}
