# Biswas Bike Rent

![Biswas Bike Rent logo](images/logo.svg)

A bike rental management system built with **HTML, CSS and JavaScript** for the Web Technologies course (CSC 3222) at AIUB.
Customers browse and book motorbikes, scooters and bicycles. The admin manages bikes, rentals, customers and messages.

There is no server. All data is saved in the browser's **localStorage**, so it stays after a refresh.

---

## 1. Features

**Customer side**
- Home page with live numbers, featured bikes and quick search
- Bike list with search, filter (type, branch, available only) and sort (price, name)
- Register and login with full form validation
- Booking form with live price calculation (days x rate + helmet - 10% discount for 7+ days)
- Validation for Bangladeshi phone (01XXXXXXXXX), NID (10/13/17 digits), license, dates, payment, terms
- My Rentals page with booking history, receipt, print and cancel
- Contact form (saved for the admin), branch table and FAQ

**Admin side** (`admin.html`)
- Overview: 8 stat cards, revenue bar chart by bike type, latest bookings
- Bikes: add, edit, delete, search, set maintenance
- Rentals: filter by status, mark returned (late fee is calculated automatically), cancel
- Customers: bookings count and total spent for each customer
- Messages from the contact form
- Reset demo data button

## 2. Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@biswasbike.com | admin123 |
| Customer | customer@biswasbike.com | 123456 |

## 3. How to run

1. Download or clone the project.
2. Open `index.html` in Chrome, Edge or Firefox (double-click works).
3. Better option: in VS Code install the **Live Server** extension, right-click `index.html` and choose *Open with Live Server*.

## 4. Folder structure

```
biswas-bike-rent/
├── index.html         Home page
├── bikes.html         Bike list with search/filter/sort
├── rent.html          Booking form + live price summary
├── my-rentals.html    Customer's bookings and receipts
├── login.html         Login
├── register.html      Register
├── contact.html       About, contact form, branches, FAQ
├── admin.html         Admin dashboard
├── css/
│   └── style.css      All styles (one external stylesheet)
├── js/
│   ├── storage.js     Shared data, helpers, header, bike pictures (used by every page)
│   ├── home.js
│   ├── bikes.js
│   ├── rent.js
│   ├── my-rentals.js
│   ├── auth.js        Login + register
│   ├── contact.js
│   └── admin.js
└── images/
    ├── logo.svg       Full logo
    └── logo-icon.svg  Icon + favicon
```

## 5. Course topics used (for the viva)

| Lecture topic | Where you can show it |
|---|---|
| HTML head, title, favicon, meta | Top of every `.html` file |
| Block/inline, tables, forms, anchors | `admin.html` tables, `rent.html` form, footer links |
| CSS selectors (element, id, class, grouping, universal) | `css/style.css` sections 1 to 4 |
| External CSS, box model (`box-sizing`) | `style.css` section 1 |
| Position: sticky, absolute, fixed | Header (sticky), status badge on bike card (absolute), toast (fixed) |
| Website layout: header, nav, content, footer | Every page |
| JS variables, data types, operators | `rent.js` `calculatePrice()` |
| if/else, switch, for loops | `storage.js` `statusBadge()` (switch), `bikes.js` `renderBikes()` (loop + if) |
| Arrays and objects | Bikes, users and rentals are arrays of objects |
| Functions and events | `addEventListener("change", updateSummary)` in `rent.js` |
| DOM: innerHTML, style, getElementById | Every JS file |
| Form validation | `rent.js` `validateRentForm()`, `auth.js` |
| Output: alert, console.log, innerHTML | Booking confirmation uses `alert()` |

---

# Project Roadmap

## Step 0. Team split (4 members)

Each member owns their own files. This means fewer merge conflicts, and every member's name appears in the GitHub history.

| Member | Role | Files they write and push |
|---|---|---|
| **Member 1** (Leader) | Repo setup, shared code, home page | `css/style.css`, `js/storage.js`, `images/`, `index.html`, `js/home.js`, `README.md` |
| **Member 2** | Bikes and booking | `bikes.html`, `js/bikes.js`, `rent.html`, `js/rent.js` |
| **Member 3** | Accounts and customer area | `login.html`, `register.html`, `js/auth.js`, `my-rentals.html`, `js/my-rentals.js`, `contact.html`, `js/contact.js` |
| **Member 4** | Admin dashboard | `admin.html`, `js/admin.js` |

If your group has 3 members, Member 3 also takes `contact.html`/`contact.js` and Member 1 takes the admin Customers and Messages panels.
If you have 5, give `contact.html` + `js/contact.js` to Member 5.

## Step 1. One-time GitHub setup

**Everyone**
1. Create a GitHub account and install Git: https://git-scm.com/downloads
2. Set your name and email (use the same email as your GitHub account, or your commits will not count on your profile):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

**Member 1 (Leader)**
1. On GitHub click **New repository** → name it `biswas-bike-rent` → Public → tick *Add a README* → Create.
2. Go to **Settings → Collaborators → Add people** and add the other members by username.
3. Each member must accept the invite from their email or GitHub notifications.

**Members 2, 3, 4**
```bash
git clone https://github.com/LEADER-USERNAME/biswas-bike-rent.git
cd biswas-bike-rent
```

## Step 2. Daily workflow (everyone, every time)

Work on your own branch, never directly on `main`.

```bash
git checkout main
git pull                          # get everyone's latest work
git checkout -b feature/bikes     # once: create your branch (use your part's name)
# ... write code ...
git add .
git commit -m "Add bike search and type filter"
git push -u origin feature/bikes  # first push; later just: git push
```

Then on GitHub: **Pull requests → New pull request → base: main ← compare: feature/bikes → Create**.
Another member reviews it and clicks **Merge**. After a merge, everyone runs `git checkout main` and `git pull`.

To start your next task, update your branch with the latest main:
```bash
git checkout feature/bikes
git merge main
```

**Branch names:** `feature/shared-and-home`, `feature/bikes-rent`, `feature/auth-customer`, `feature/admin`

## Step 3. Timeline (4 weeks)

Build and push in small pieces. Do **not** upload the whole project in one commit on the last day. Teachers check the commit history, and one giant commit looks copied.

### Week 1: Base (Member 1 must finish first; others start in week 1 using the base)
| Member | Tasks | Example commits |
|---|---|---|
| M1 | Repo, folder structure, logo, `style.css` (variables, header, footer, buttons), `storage.js` (data + save/load + helpers) | `Create folder structure and logo`, `Add base CSS and header/footer`, `Add localStorage data layer with default bikes` |
| M2 | `bikes.html` layout using the header/footer | `Create bikes page layout` |
| M3 | `login.html` and `register.html` forms (HTML + CSS only) | `Create login and register forms` |
| M4 | `admin.html` layout with side menu and empty tables | `Create admin dashboard layout` |

### Week 2: Main features
| Member | Tasks | Example commits |
|---|---|---|
| M1 | `index.html` hero, stats, steps, featured bikes; `home.js` | `Add home page sections`, `Show live stats and featured bikes` |
| M2 | Bike cards, search, filter, sort; `rent.html` form | `Render bike cards from data`, `Add search, filter and sort`, `Create booking form` |
| M3 | Register + login logic with validation | `Add register validation`, `Add login and session` |
| M4 | Panel switching, overview stat cards | `Add side menu panel switching`, `Show overview stats` |

### Week 3: Connect everything
| Member | Tasks | Example commits |
|---|---|---|
| M1 | Mobile CSS (`@media`), nav login state, toast | `Add responsive styles`, `Show user name and logout in nav` |
| M2 | Live price summary, booking validation, save rental | `Add live price calculation`, `Validate booking form`, `Save rental and mark bike rented` |
| M3 | My Rentals page, receipt, cancel; contact form | `Add booking history`, `Add receipt and cancel`, `Add contact form` |
| M4 | Bike add/edit/delete, rentals return/cancel with late fee | `Add bike CRUD`, `Add mark returned with late fee` |

### Week 4: Test, polish, deploy
| Member | Tasks |
|---|---|
| Everyone | Test the full flow below, fix bugs on your own files, push fixes |
| M1 | Deploy to GitHub Pages, finish README with screenshots |
| M4 | Customers + Messages panels, revenue chart, reset button |

**Full test flow before submission**
1. Register a new account → you land on the Bikes page.
2. Search "yamaha", filter by Scooter, sort by price.
3. Rent a bike for 7 days with a helmet → check the 10% discount.
4. Submit the form empty → every field should show a red error.
5. Open My Rentals → view receipt → print.
6. Book a bike for a future date → cancel it → the bike becomes Available.
7. Send a contact message.
8. Logout → login as admin → check stats, add a bike, edit a bike, mark a rental returned, read the message.
9. Open the site on your phone (or Chrome DevTools mobile view).

## Step 4. Deploy for free with GitHub Pages

1. Repo → **Settings → Pages**.
2. Source: **Deploy from a branch** → Branch: `main` → folder `/ (root)` → Save.
3. After 1 to 2 minutes your site is live at `https://LEADER-USERNAME.github.io/biswas-bike-rent/`
4. Put this link at the top of the README and in your report.

## Step 5. Viva preparation

Each member should be able to answer these for **their own files**:
- What does each function do? Walk through one line by line.
- Why `localStorage`, and why `JSON.stringify` / `JSON.parse`?
- How does the form validation work? Show one regex (phone: `/^01[3-9][0-9]{8}$/`).
- How is the price calculated? Example: 7 days x ৳1,500 = ৳10,500, + ৳100 helmet, - ৳1,050 discount = ৳9,550.
- How is the late fee calculated? (late days x price per day)
- Difference between `id` and `class` selectors, and why the header uses `position: sticky`.
- What is the DOM, and how does `innerHTML` change the page?
- Show your commits on GitHub (`Insights → Contributors`).

**Likely trick question:** "Is storing passwords in localStorage safe?"
Answer: No. Anyone with access to the browser can read them. A real system checks passwords on the server and stores only a hash. We will move this to PHP + MySQL later in the course.

## Step 6. Common Git problems

| Problem | Fix |
|---|---|
| `rejected ... fetch first` when pushing | `git pull` then `git push` |
| Merge conflict | Open the file, keep the right code between `<<<<<<<` and `>>>>>>>`, delete the markers, then `git add .` and `git commit` |
| Commits not showing on your profile | Your `git config user.email` does not match your GitHub email. Fix it, future commits will count |
| Asked for a password on push | GitHub needs a Personal Access Token: Settings → Developer settings → Tokens. Or use GitHub Desktop |
| Pushed to the wrong branch | Tell the leader before anyone merges. Do not force-push to `main` |

## Ideas if you want extra marks
- Bike details page (`bike.html?id=B101`) with more photos and specs
- Ratings and reviews after a rental is returned
- Dark mode toggle
- Export rentals as CSV from the admin panel
- Later in the course: move data to PHP + MySQL with real login sessions
