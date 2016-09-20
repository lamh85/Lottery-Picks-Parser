// Use jQuery for simple DOM manipulation. This app is too simple to warrant using React JS.
import $ from "jquery"
import baseProcessor from "./baseProcessor"

const submitToProcessor = (rawInput) => {
  var sanitized = rawInput.replace(/[^,0-9]/g, "")
  var array = sanitized.split(",")
  var filteredArray = array.filter(value => value.length > 0)

  return baseProcessor(filteredArray)
}

const renderResults = (results) => {
  var html = ""
  for (var property in results) {
    html += "<tr>"
    html += "<td>" +property+ "</td>"
    html += "<td>" +results[property]+ "</td>"
    html += "</tr>"
  }
  $('tbody').html(html)
}

$(document).ready(function(){
  const handleSubmit = event => {
    var rawInput = $("textarea").val()
    var results = submitToProcessor(rawInput)
    renderResults(results)
  }

  $("button").click(handleSubmit)
})