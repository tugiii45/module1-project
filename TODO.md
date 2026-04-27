# Plan: Remove Claim Alert, Replace with Inline Message

## Steps
- [ ] Edit `script.js`: Replace `confirm()` in `claimBook()` with inline confirmation UI inside the book card
- [ ] Edit `style.css`: Add styles for `.inline-confirm`, `.inline-confirm-buttons`, `.confirm-btn`, `.cancel-btn`
- [ ] Test by opening `listings.html` in browser

## Changes Summary
- `script.js`: Modify `claimBook(id)` to show inline message + Confirm/Cancel buttons; add helper functions `confirmClaim(id)` and `cancelClaim(id)`
- `style.css`: Style inline confirmation message and buttons within card context

