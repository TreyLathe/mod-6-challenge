let dateTime = document.getElementById("dateTime");

function dateTimeUpdate() {
  let rightNow = dayjs().format("dddd, MMMM DD YYYY");
  dateTime.textContent = rightNow;
}

setInterval(dateTimeUpdate, 1000) ;