// TODO: connect a form endpoint (the site's own API, Formspree or similar) here.
// Until then this resolves without sending anything, so the form can be designed and tested.
export async function sendMessage(fields) {
  return { ok: true, fields }
}
