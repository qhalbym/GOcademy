function getPublisedTime(date) {
  let currentDate = new Date();
  let publisedDate = new Date(date);

  if(currentDate.getHours() == publisedDate.getHours()) {
    return `${Math.abs(currentDate.getMinutes() - publisedDate.getMinutes())} Minutes Ago`
  } else {
    return `${Math.abs(currentDate.getHours() - publisedDate.getHours())} Hour(s) Ago`
  }
}

module.exports = getPublisedTime;