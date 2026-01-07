[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#) [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#) [![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#) 

# Friend Finder
Have you ever wondered who you share classes with? Friend Finder is a simple local-hosted webapp for students to see which classmates they share courses with, sorted by the most shared courses. Its main goal is to help students find friends and collaborators within the same term.

<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/a8bd9462-4b6e-4394-9653-f9d3628b5217" />



## Features
- Filter classmates by term/year code.
- Shows the number of shared courses.
- Displays the names and course titles of classmates you share multiple courses with.
- Sorts classmates by most shared courses.

## Usage
1. Clone the repository.

```bash
git clone (https://github.com/rea-prince/FriendFinder.git)
cd FriendFinder
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
node src/server.js
```

5. Open the webapp by going to `http://localhost:3000` and entering a term/year code (like 1252) to see classmates for that term. Leave the search bar blank to search through all enrolled courses.

## Disclaimer
- For personal use only. Friend Finder is intended for students to find friends and collaborators.
- Please do not share your generated token or misuse Canvas data.
- Respect your school’s policies regarding data access and privacy. Use this tool responsibly and only on your own account.
