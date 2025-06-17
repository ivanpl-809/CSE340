'use strict'

// Get a list of items in inventory based on the classification_id
document.addEventListener("DOMContentLoaded", function () {
  const classificationList = document.querySelector("#classificationList")
  if (!classificationList) return

  classificationList.addEventListener("change", function () {
    const classification_id = classificationList.value
    const classIdURL = "/inv/getInventory/" + classification_id

    fetch(classIdURL)
      .then(function (response) {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Network response was not OK")
      })
      .then(function (data) {
        buildInventoryList(data)
      })
      .catch(function (error) {
        console.error("There was a problem: ", error.message)
      })
  })
})

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay")

  let dataTable = '<thead>'
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'
  dataTable += '</thead>'
  dataTable += '<tbody>'

  data.forEach(function (vehicle) {
    dataTable += `<tr><td>${vehicle.inv_make} ${vehicle.inv_model}</td>`
    dataTable += `<td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>`
    dataTable += `
      <td>
        <form action="/inv/delete" method="POST" onsubmit="return confirm('Are you sure you want to delete this vehicle?');">
          <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
          <button type="submit" title="Click to delete">Delete</button>
        </form>
      </td></tr>`
  })

  dataTable += '</tbody>'
  inventoryDisplay.innerHTML = dataTable
}