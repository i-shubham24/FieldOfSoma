// TODO: connect the newsletter provider (Buttondown, Mailchimp or similar) here.
// Until then this resolves without sending anything, so the form can be designed and tested.
export async function subscribe(email) {
  return { ok: true, email }
}

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
