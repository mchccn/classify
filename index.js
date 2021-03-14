const Node = classify`
Node [name]
    this.name = name;

getName []
    return this.name;


setName [newName]
    this.name = newName;
    return this;
`;

console.log(Node);

const n = new Node("bob");

console.log(n);

n.setName("alice");

console.log(n);

function classify(strings, ...values) {
    const code = (typeof strings === "string" ? strings : strings.map((s, i) => s + (values[i] || "")).join(""))
        .split("\n")
        .map((l) => l.trimEnd())
        .filter((l) => l);

    if (!/^[a-zA-Z$_][a-zA-Z0-9$_]*\s+\[([a-zA-Z$_][a-zA-Z0-9$_ ]*)?\]$/.test(code[0])) throw new Error("First line must be the constructor.");

    const constructorHeader = code.shift();

    const className = constructorHeader.split("[")[0].trim();

    const constructorParams = constructorHeader
        .match(/\[(.*)\]/)[1]
        .trim()
        .split(/\s+/);

    const index = code.findIndex((l) => !/^\s+/.test(l));

    const constructor = code
        .splice(0, index < 0 ? code.length : index)
        .map((l) => l.trim())
        .join("\n");

    let methods = "";

    for (const line of code) {
        if (/^\+?[a-zA-Z$_][a-zA-Z0-9$_]*\s+\[([a-zA-Z$_][a-zA-Z0-9$_ ]*)?\]$/.test(code[0])) {
            const methodHeader = code.shift();

            const methodName = methodHeader.split("[")[0].trim();

            const methodParams = methodHeader
                .match(/\[(.*)\]/)[1]
                .trim()
                .split(/\s+/);

            const index = code.findIndex((l) => !/^\s+/.test(l));

            const method = code
                .splice(0, index < 0 ? code.length : index)
                .map((l) => l.trim())
                .join("\n");

            methods += `${methodName.startsWith("+") ? `static ${methodName.slice(1)}` : methodName} (${methodParams}) {
                ${method}
            }\n\n`;
        }
    }

    return new Function(`
        return class ${className} {
            constructor (${constructorParams.join(", ")}) {
                ${constructor}
            }

            ${methods}
        }
    `)();
}
