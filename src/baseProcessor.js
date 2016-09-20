import stringProcessor from './stringProcessor'

const baseProcessor = (arrayOfStrings) => {
  var resultsJson = {}

  arrayOfStrings.map(string => {
    resultsJson[string] = stringProcessor(string)
  })

  return resultsJson
}

export default baseProcessor