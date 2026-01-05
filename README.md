# Friend Finder
Have you ever wondered who you share classes with? Friend Finder is a simple local-hosted webapp for students to see which classmates they share courses with, sorted by the most shared courses. Its main goal is to help students find friends and collaborators within the same term.

## Features
- Filter classmates by term/year code.
- Shows the number of shared courses.
- Displays the names and course titles of classmates you share multiple courses with.
- Sorts classmates by most shared courses.

## Usage
1. Clone the repository.

```bash
git clone (https://github.com/rea-prince/Friend-Finder.git)
cd Friend-Finder
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file containing your Canvas domain name as well as your generated access token.
- `ACCESS_TOKEN`: Generate this in your Canvas profile under Account -> Settings -> New Access Token.
- `CANVAS_DOMAIN`: Usually something like `your-school.instructure.com`.

```
ACCESS_TOKEN=your_canvas_access_token
CANVAS_DOMAIN=your_canvas_domain
```

4. Run the server.

```bash
node server.js
```

5. Open the webapp by going to `http://localhost:3000` and entering a term/year code (like 1252) to see classmates for that term.

## Disclaimer
- For personal use only. Friend Finder is intended for students to find friends and collaborators.
- Please do not share your generated token or misuse Canvas data.
- Respect your school’s policies regarding data access and privacy. Use this tool responsibly and only on your own account.
