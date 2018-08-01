// Defining a 'parser' function that accepts our array of 'tokens'
function parser(tokens) {

    // Keeping a 'current' variable used as a cursor
    let current = 0;

    // Recursive while 'loop' walk function
    function walk() {

        // Inside the walk function we start by grabbing the 'current' token.
        let token = tokens[current];

        // We're going to split each type of token off into a diff code path,
        // starting off with 'number' tokens.
        //
        // We test to see if we have a 'number' token .
        if (token.type === 'number') {

            // If so, increment
            current++;

            // And we'll return a new AST node called 'Numberliteral' and setting
            // its value to the value of our token.
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        // If we ahve a string we will do the same as number and create a 
        // 'StringLiteral' node.
        if (token.type === 'string') {
            current++;

            return {
                type: 'StringLiteral',
                value: token.value,
            }
        }

        // Next we're going to look for CallExpressions. We start this off
        // when we encounter an open parenthesis.
        if (
            token.type === 'paren' &&
            token.value === '('
        ) {

            //We'll increment 'current' to skip the parenthesis since we don't care
            // about it in our AST.
            token = tokens[++current];

            // We create a base node with the type 'CallExpression', and we're going 
            // to set the name as the current token's value since the next token after
            // the open parenthesis is the name of the function.
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            };

            // We increment 'current' *again* to skip the name token.
            token = tokens[++current];

            // In order to handle the potentially infinite nature of function calls, 
            // we'll use recursion.
            // We create a 'while' loop that will continue until it encounters a
            // token with a 'type' of 'paren' and a 'value' of a closing parenthesis.
            while (
                (token.type !== 'paren') ||
                (token.type === 'paren' && token.value !== ')')
            ) {
                // We'll call the 'walk' function which will return a 'node' and we'll
                // push it into our 'node.params'.
                node.params.push(walk());
                token = tokens[current];
            }

            // Finally we will increment 'current' one last time to skip the closing
            // parenthesis.
            current++;

            // And return the node.
            return node;
        }

        // If we haven't recognized the token type by now we're going to throw and error.
        throw new TypeError(token.type);
    }

    // Now, we're going to create our AST which will have a root which is a
    // 'Program' node.
    let ast = {
        type: 'Program',
        body: [],
    };

    // And we're going to kickstart our 'walk' function, pushing nodes to our 'ast.body' array.
    //
    // The reason we are doing this inside a loop is because our program can have 
    // 'CallExpression' after one another instead of being nested.
    //
    //  (add 2 2)
    //  (subtract 4 2)
    //
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    // At the end of our parser we'll return the AST.
    return ast;
}   

// Just exporting our parser to be used in the final compiler...
module.exports = parser;