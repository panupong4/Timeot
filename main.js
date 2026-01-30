const person = document.getElementById("person");
const dateEl = document.getElementById("date");
const shift = document.getElementById("shift");
const timeIn = document.getElementById("timeIn");
const timeOut = document.getElementById("timeOut");
const otRate = document.getElementById("otRate");
const otHour = document.getElementById("otHour");
const save = document.getElementById("save");
const list = document.getElementById("list");
const customBox = document.querySelector(".custom");

const filterPerson = document.getElementById("filterPerson");
const filterDate = document.getElementById("filterDate");

let data = JSON.parse(localStorage.getItem("workData")) || [];
let editId = null;

shift.onchange = () => {
  customBox.classList.toggle("hidden", shift.value !== "custom");
};

filterPerson.onchange = draw;
filterDate.onchange = draw;

save.onclick = () => {
  const time =
    shift.value === "custom" ?
    `${timeIn.value} - ${timeOut.value}` :
    shift.value;
  
  const ot =
    otRate.value !== "0" && otHour.value ?
    `${otRate.value}/${otHour.value}` :
    "-";
  
  if (editId) {
    const item = data.find(d => d.id === editId);
    Object.assign(item, {
      person: person.value,
      date: dateEl.value,
      time,
      ot
    });
    editId = null;
    save.textContent = "💾 บันทึก";
  } else {
    data.push({
      id: Date.now(),
      person: person.value,
      date: dateEl.value,
      time,
      ot
    });
  }
  
  localStorage.setItem("workData", JSON.stringify(data));
  clearForm();
  draw();
};

function draw() {
  list.innerHTML = "";
  
  data.filter(item => {
    if (filterPerson.value !== "all" && item.person !== filterPerson.value)
      return false;
    if (filterDate.value && item.date !== filterDate.value)
      return false;
    return true;
  }).forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.person}</td>
      <td>${item.date}</td>
      <td>${item.time}</td>
      <td>${item.ot}</td>
      <td>
        <button class="edit">✏️</button>
        <button class="delete">🗑</button>
      </td>
    `;
    
    tr.querySelector(".delete").onclick = () => {
      data = data.filter(d => d.id !== item.id);
      localStorage.setItem("workData", JSON.stringify(data));
      tr.remove();
    };
    
    tr.querySelector(".edit").onclick = () => {
      person.value = item.person;
      dateEl.value = item.date;
      shift.value = item.time;
      editId = item.id;
      save.textContent = "✅ อัปเดต";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    list.appendChild(tr);
  });
}

function clearForm() {
  dateEl.value = "";
  otRate.value = "0";
  otHour.value = "";
  shift.value = "07:00-15:00";
  customBox.classList.add("hidden");
}

draw();