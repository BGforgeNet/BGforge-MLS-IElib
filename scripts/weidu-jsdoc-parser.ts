/**
 * WeiDU JSDoc Parser
 *
 * Parses JSDoc-style comments from WeiDU .tpa files to generate documentation.
 * Extracts function descriptions, parameters, returns, and deprecation notices.
 */

export interface JsDocParam {
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: string;
    varType?: 'INT_VAR' | 'STR_VAR';
}

export interface JsDocReturn {
    name: string;
    type: string;
    description: string;
    isArray?: boolean;
}

export interface JsDocBlock {
    description: string;
    params: JsDocParam[];
    returns: JsDocReturn[];
    deprecated?: string;
}

export interface FunctionSignature {
    name: string;
    type: 'patch' | 'action';
    intVars: Record<string, string>;
    strVars: Record<string, string>;
    ret: string[];
    retArray: string[];
}

export interface WeiduFunction {
    name: string;
    type: 'patch' | 'action';
    description: string;
    params: JsDocParam[];
    returns: JsDocReturn[];
    deprecated?: string;
}

/**
 * Parses a JSDoc comment block and extracts structured information.
 */
export function parseJsDocBlock(comment: string): JsDocBlock {
    const result: JsDocBlock = {
        description: '',
        params: [],
        returns: [],
    };

    // Normalize line endings
    const normalized = comment.replace(/\r\n/g, '\n');

    // Remove /** and */ and leading asterisks
    const lines = normalized
        .replace(/^\/\*\*\s*/, '')
        .replace(/\s*\*\/$/, '')
        .split('\n')
        .map((line) => line.replace(/^\s*\*\s?/, ''));

    const descriptionLines: string[] = [];
    let currentTag: string | null = null;
    let currentTagContent: string[] = [];

    const processCurrentTag = () => {
        if (!currentTag) return;

        const content = currentTagContent.join(' ').trim();

        if (currentTag === 'param') {
            const param = parseParamTag(content);
            if (param) result.params.push(param);
        } else if (currentTag === 'return') {
            const ret = parseReturnTag(content);
            if (ret) result.returns.push(ret);
        } else if (currentTag === 'deprecated') {
            result.deprecated = content;
        }

        currentTag = null;
        currentTagContent = [];
    };

    for (const line of lines) {
        const tagMatch = line.match(/^@(\w+)\s*(.*)/);

        if (tagMatch) {
            // Process previous tag if any
            processCurrentTag();

            currentTag = tagMatch[1];
            currentTagContent = [tagMatch[2]];
        } else if (currentTag) {
            // Continue previous tag (multi-line)
            currentTagContent.push(line.trim());
        } else {
            // Part of description
            descriptionLines.push(line);
        }
    }

    // Process final tag
    processCurrentTag();

    // Join description lines, preserving multi-line format
    result.description = descriptionLines.join('\n').trim();

    return result;
}

/**
 * Parses a @param tag content.
 * Format: {type} name! - description  OR  name - description
 */
function parseParamTag(content: string): JsDocParam | null {
    // Pattern: optional {type}, name with optional !, optional - description
    const match = content.match(/^(?:\{(\w+)\}\s+)?(\w+)(!)?(?:\s*-\s*(.*))?$/);

    if (!match) return null;

    const [, type, name, required, description] = match;

    return {
        name,
        type: type || 'string',
        description: (description || '').trim(),
        required: required === '!',
    };
}

/**
 * Parses a @return tag content.
 * Format: name {type} - description  OR  name - description
 */
function parseReturnTag(content: string): JsDocReturn | null {
    // Pattern: name, optional {type}, optional - description
    const match = content.match(/^(\w+)(?:\s+\{(\w+)\})?(?:\s*-\s*(.*))?$/);

    if (!match) return null;

    const [, name, type, description] = match;

    return {
        name,
        type: type || 'string',
        description: (description || '').trim(),
    };
}

/**
 * Parses a WeiDU function signature (DEFINE_PATCH_FUNCTION or DEFINE_ACTION_FUNCTION).
 */
export function parseFunctionSignature(code: string): FunctionSignature | null {
    // Normalize line endings
    const normalized = code.replace(/\r\n/g, '\n');

    // Match function definition
    const funcMatch = normalized.match(
        /DEFINE_(PATCH|ACTION)_FUNCTION\s+(\w+)/i
    );

    if (!funcMatch) return null;

    const result: FunctionSignature = {
        name: funcMatch[2],
        type: funcMatch[1].toLowerCase() as 'patch' | 'action',
        intVars: {},
        strVars: {},
        ret: [],
        retArray: [],
    };

    // Extract the header portion (everything before BEGIN)
    const headerMatch = normalized.match(
        /DEFINE_(?:PATCH|ACTION)_FUNCTION\s+\w+([\s\S]*?)BEGIN/i
    );

    if (!headerMatch) return result;

    const header = headerMatch[1];

    // Parse INT_VAR section
    const intVarMatch = header.match(/INT_VAR([\s\S]*?)(?=STR_VAR|RET(?:_ARRAY)?|BEGIN|$)/i);
    if (intVarMatch) {
        result.intVars = parseVarSection(intVarMatch[1]);
    }

    // Parse STR_VAR section
    const strVarMatch = header.match(/STR_VAR([\s\S]*?)(?=INT_VAR|RET(?:_ARRAY)?|BEGIN|$)/i);
    if (strVarMatch) {
        result.strVars = parseVarSection(strVarMatch[1]);
    }

    // Parse RET section (but not RET_ARRAY)
    const retMatch = header.match(/\bRET\b(?!_ARRAY)([\s\S]*?)(?=RET_ARRAY|BEGIN|$)/i);
    if (retMatch) {
        result.ret = parseRetSection(retMatch[1]);
    }

    // Parse RET_ARRAY section
    const retArrayMatch = header.match(/RET_ARRAY([\s\S]*?)(?=RET\b(?!_)|BEGIN|$)/i);
    if (retArrayMatch) {
        result.retArray = parseRetSection(retArrayMatch[1]);
    }

    return result;
}

/**
 * Parses a variable section (INT_VAR or STR_VAR) and extracts name = value pairs.
 */
function parseVarSection(section: string): Record<string, string> {
    const vars: Record<string, string> = {};

    // Remove comments
    const cleaned = section.replace(/\/\/.*$/gm, '');

    // Match name = value patterns
    // Value can be: number, "string", ~string~, or quoted negative like "-1"
    const pattern = /(\w+)\s*=\s*("(?:[^"\\]|\\.)*"|~[^~]*~|[^\s,]+)/g;
    let match;

    while ((match = pattern.exec(cleaned)) !== null) {
        vars[match[1]] = match[2];
    }

    return vars;
}

/**
 * Parses a RET or RET_ARRAY section and extracts variable names.
 */
function parseRetSection(section: string): string[] {
    const names: string[] = [];

    // Split by whitespace and filter to valid identifiers
    const tokens = section.trim().split(/\s+/);

    for (const token of tokens) {
        // Valid WeiDU identifier
        if (/^\w+$/.test(token)) {
            names.push(token);
        }
    }

    return names;
}

/**
 * Main parsing function: extracts all documented WeiDU functions from source code.
 */
export function parseWeiduJsDoc(code: string): WeiduFunction[] {
    const functions: WeiduFunction[] = [];

    // Normalize line endings
    const normalized = code.replace(/\r\n/g, '\n');

    // Find all JSDoc blocks
    const jsDocPattern = /\/\*\*[\s\S]*?\*\//g;
    let jsDocMatch: RegExpExecArray | null;

    while ((jsDocMatch = jsDocPattern.exec(normalized)) !== null) {
        const jsDocBlock = jsDocMatch[0];
        const jsDocEnd = jsDocMatch.index + jsDocBlock.length;

        // Find the next DEFINE_*_FUNCTION after this JSDoc
        const afterJsDoc = normalized.slice(jsDocEnd);

        // Find position of next DEFINE_*_FUNCTION
        const defineMatch = afterJsDoc.match(/DEFINE_(?:PATCH|ACTION)_FUNCTION/i);
        if (!defineMatch || defineMatch.index === undefined) continue;

        // Check that only whitespace exists between JSDoc end and DEFINE
        const betweenContent = afterJsDoc.slice(0, defineMatch.index);
        if (/[^\s]/.test(betweenContent)) continue;

        // Now extract the full function
        const funcMatch = afterJsDoc.match(
            /(DEFINE_(?:PATCH|ACTION)_FUNCTION[\s\S]*?^END)/im
        );

        if (!funcMatch) continue;

        const functionCode = funcMatch[1];

        const jsDoc = parseJsDocBlock(jsDocBlock);
        const signature = parseFunctionSignature(functionCode);

        if (!signature) continue;

        // Merge JSDoc with signature
        const func = mergeJsDocWithSignature(jsDoc, signature);
        functions.push(func);
    }

    return functions;
}

/**
 * Merges parsed JSDoc information with function signature.
 */
function mergeJsDocWithSignature(
    jsDoc: JsDocBlock,
    signature: FunctionSignature
): WeiduFunction {
    const params: JsDocParam[] = [];
    const returns: JsDocReturn[] = [];

    // Create a map of documented params by name
    const docParamMap = new Map<string, JsDocParam>();
    for (const param of jsDoc.params) {
        docParamMap.set(param.name, param);
    }

    // Create a map of documented returns by name
    const docReturnMap = new Map<string, JsDocReturn>();
    for (const ret of jsDoc.returns) {
        docReturnMap.set(ret.name, ret);
    }

    // Process INT_VAR params (in order from signature)
    for (const [name, defaultValue] of Object.entries(signature.intVars)) {
        const docParam = docParamMap.get(name);
        // Use JSDoc type if specified and not default 'string', otherwise infer 'int' from INT_VAR
        const inferredType = docParam?.type && docParam.type !== 'string' ? docParam.type : 'int';
        params.push({
            name,
            type: inferredType,
            description: docParam?.description || '',
            required: docParam?.required || false,
            default: defaultValue,
            varType: 'INT_VAR',
        });
        docParamMap.delete(name);
    }

    // Process STR_VAR params (in order from signature)
    for (const [name, defaultValue] of Object.entries(signature.strVars)) {
        const docParam = docParamMap.get(name);
        params.push({
            name,
            type: docParam?.type || 'string',
            description: docParam?.description || '',
            required: docParam?.required || false,
            default: defaultValue,
            varType: 'STR_VAR',
        });
        docParamMap.delete(name);
    }

    // Add any remaining documented params not in signature
    for (const param of docParamMap.values()) {
        params.push(param);
    }

    // Process RET returns
    for (const name of signature.ret) {
        const docReturn = docReturnMap.get(name);
        returns.push({
            name,
            type: docReturn?.type || 'string',
            description: docReturn?.description || '',
            isArray: false,
        });
        docReturnMap.delete(name);
    }

    // Process RET_ARRAY returns
    for (const name of signature.retArray) {
        const docReturn = docReturnMap.get(name);
        returns.push({
            name,
            type: docReturn?.type || 'array',
            description: docReturn?.description || '',
            isArray: true,
        });
        docReturnMap.delete(name);
    }

    // Add any remaining documented returns not in signature
    for (const ret of docReturnMap.values()) {
        returns.push(ret);
    }

    return {
        name: signature.name,
        type: signature.type,
        description: jsDoc.description,
        params,
        returns,
        deprecated: jsDoc.deprecated,
    };
}
