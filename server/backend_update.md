# Backend Updates

### 2024-06-28 — Impact page no longer fetches charities
- On the Impact (`/charity`) page, removed the charity cards, filters, and API call that fetched charities from `GET /charities`
- Backend will no longer serve charity listing data to this page
- Only the "Apply as a Charity" button remains on the page (links to `/apply-charity`)
