function formatDate(date) {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleString('id-ID', options)
}

module.exports = formatDate