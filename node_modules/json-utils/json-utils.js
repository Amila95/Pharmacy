
var fs = require('fs')
var JSONLint = require('json-lint')

/** open a file and return the parsed JSON content 
 *
 * defaults to utf8 encoding to read the file
 *
 */
function readJSONSync(fileName, options) {
  if(!options) {
    options = {}
  }
  if(!options.encoding) {
    options.encoding = 'utf8'
  }
  var fileContent = fs.readFileSync(fileName, options)
  var lintResult = JSONLint(fileContent, { comments: false})
  if(lintResult.error) {
    var errorMsg = 'Failed to parse JSON file ['+fileName+']:'
    errorMsg += '\n' + lintResult.error
    errorMsg += ' line:' + lintResult.line
    errorMsg += ', character:' + lintResult.character
    errorMsg += '\n' + lintResult.evidence
    var parseError = new Error(errorMsg)
    parseError.originalContent = lintResult.json
    parseError.line = lintResult.line
    parseError.character = lintResult.character
    parseError.evidence = lintResult.evidence
    throw parseError
  }
  var jsonContent = JSON.parse(fileContent)
  return jsonContent
}


module.exports = {
  readJSONSync: readJSONSync
}
