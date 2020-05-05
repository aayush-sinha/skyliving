var count = 1;
function checkCount(count) {
  if (count >= 4) {
    document.getElementById("addButton").disabled = true;
  } else document.getElementById("addButton").disabled = false;
}
function addHandler() {
  count = count + 1;
  checkCount(count);
  var x = document.getElementById("priceCategories");
  var divId = "divId" + count;
  console.log(divId);
  x.innerHTML += `<div id="${divId}" class="row border border-info">
  <div class="form-group col">

  <label for="propOccupancy">Occupancy Type</label>
  <select class="form-control" id="propOccupancy" name="propOccupancy">
      <option>1 seater</option>
      <option>2 seater</option>
      <option>3 seater</option>

  </select>
</div>
<div class="form-group col">
  <label for="propCooling">Cooling Type</label>
  <select class="form-control" id="propCooling" name="propCooling">
      <option>AC</option>
      <option>Non AC</option>
  </select>
</div>
<div class="form-group col">
  <label for="propPrice">Price:</label>
  <input type="text" class="form-control" id="propPrice" placeholder="Enter Price"
      name="propPrice">
</div>


    <div class="btn-group mr-2">
        <button type="button" class="btn btn-danger" onclick="removeHandler('${divId}')">-</button>
    </div>
</div>`;
}

function removeHandler(divId) {
  document.getElementById(divId).remove();
  count = count - 1;
  checkCount(count);
}
