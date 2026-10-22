# Field of Soma: status and next steps (22 Oct 2026)

## Done

**Following the client's brief**
- One name per practice everywhere: Somatic Movement Therapy, Tai Chi and Creative Movement. Creative Movement stays a full third practice until Kirti sends her writing for it.
- Home keeps her hero quote, the manifesto, the "Listening to the Sensing Body" story, the three practices, the Somatics window, sample reviews and the invitation.
- Her own practice text, from the "Website notes" doc, is used word for word.
- Only her own photos are used, saved as small WebP files in two sizes. All Unsplash stock photos are gone, and the photo descriptions are corrected.

**Honest by default**
- Anything not yet confirmed carries a small draft note: the About story, training and lineage, the reviews, the class catalogue, the articles and the schedule.
- Medical overclaims are softened, and the footer says that somatic education is not medical treatment.

**Recorded classes: a shop like Udemy**
- The class list has a filter row (All Classes, My Videos, each practice) and two views: Grid and Full Screen.
- The class page shows a free preview, Add to cart and Buy now.
- The cart lives at `/cart`. Checkout at `/checkout` takes three steps: details, review and pay, confirmation. After that, the class appears in My Videos.
- Payment uses Razorpay when a key is set. Without a key, checkout runs in a clearly labelled test mode and takes no money.
- The video players play a class when a video link is added. Until then they say the video is on its way.

**Forms that really send**
- Contact, booking requests and Field Notes sign-ups are sent to Kirti's inbox through Web3Forms.
- If sending fails, the visitor's message opens in their own email app, so nothing is lost.

**Booking**
- The Calendar page shows Kirti's Cal.com or Calendly calendar once its link is set.
- Until then, visitors send a request and Kirti replies.

**Writing**
- Each article has its own page at `/articles/<name>`, so it can be shared and found in search.

**Bugs and responsiveness**
- Unknown class or article links show a "not found" page.
- Pop-ups (booking, Somatic Pause, video players) keep keyboard focus inside, close with Escape, and never leave the page stuck unscrollable.
- They also fit short phone screens.
- On the Somatics page, the "Where do you hold?" section now scrolls normally on phones.
- Buttons and links are at least 44px tall.
- Form inputs are 16px, so iPhones no longer zoom in. The exception is Login and Signup, which were restored unchanged.
- Small label text is now 12px.
- The dropdown is a standard select, so it works with a keyboard and opens the phone's own picker.

**Speed and search**
- The ambient audio is down from 9.9 MB to 2.5 MB and only downloads when someone plays it.
- Photos are 70 to 80% smaller.
- The main JavaScript file is down from 291 KB to 45 KB.
- Fonts are open-licence Google Fonts. The old ones were copied from another studio's site and were blocked on the live site.
- Link previews use Kirti's own photo.
- The sitemap is rebuilt automatically from the content.
- Login, Signup, Cart, Checkout and "not found" pages are kept out of search results.

**Kept as you asked**
- Login and Signup in the menu, the footer and the story section.
- The big italic "Soma" in the footer.
- The About page, restored exactly as it is on GitHub. Only its content file changed, to add the draft notes.

## Switch things on (in Vercel, then redeploy)

| Setting | What it turns on | Where to get it |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | Contact, booking and newsletter forms send to Kirti's email | web3forms.com (free), using Kirti's email |
| `VITE_BOOKING_URL` | Live booking calendar on the Calendar page | Kirti's Cal.com or Calendly link |
| `VITE_RAZORPAY_KEY_ID` | Real payments at checkout (use the `rzp_test_` key first) | Razorpay dashboard |

For each class in `src/content/classes.js`:
- Fill in `previewUrl` (the free sample) and `videoUrl` (the full class).
- Unlisted YouTube, Vimeo or a direct .mp4 link all work.

Also replace the placeholder email and Instagram link in `src/content/site.js`.

## Questions for Kirti

1. **Your story:** your trainings (with teachers, schools and years), and what "research" means in your work.
2. **Reviews:** real words from students, and permission to use a first name and initial.
3. **Your influences:** are Feldenkrais, Body-Mind Centering, Abhyas Somatics and Somatic Intelligence trainings you completed, or influences?
4. **Creative Movement:** your text for it, when ready.
5. **Location:** where you teach (a studio or city, or online only), plus your contact email, phone or WhatsApp, and Instagram.
6. **Recorded classes:** titles, prices, lengths, and where the videos will be hosted.
7. **Sessions:** which session types and prices people can book, and your weekly class times.
8. **Newsletter:** how often you would like to send one.
9. **Writing:** any pieces of your own to replace the sample articles.

## Still to do

- **Real accounts.** Login and Signup look complete but don't yet create accounts. Purchases are saved in the visitor's browser. To tie My Videos to a profile, connect an auth service (Supabase or Clerk) and store orders there.
- **Secure payment checking.** Before selling for real, add a small server function that creates each Razorpay order and checks the payment before a class unlocks. Until then, a payment can be faked in the browser.
- **Removed section.** The "Convergence" section on Home was removed while its copy was being rewritten. Say if you want it back.
