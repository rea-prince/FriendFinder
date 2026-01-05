const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) {
  console.error("Please set ACCESS_TOKEN in your environment");
  process.exit(1);
}
console.log("Token:", process.env.ACCESS_TOKEN);

const canvasDomain = process.env.CANVAS_DOMAIN;
if (!canvasDomain) {
  console.error("Please set CANVAS_DOMAIN in your environment");
  process.exit(1);
}
console.log("Domain:", process.env.CANVAS_DOMAIN);

// API request
function canvasGet(path) {
  return new Promise((resolve, reject) => {
    // GET request format
    const options = {
      hostname: canvasDomain,
      path: `/api/v1${path}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // actual request
    const req = https.request(options, (res) => {
      let data = "";
      // append stream to data
      res.on("data", (chunk) => (data += chunk));
      // resolve + return object
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

// filter courses by term/year
function filterCoursesByTerm(courses, termYearCode) {
  return courses.filter(
    (c) => c.course_code && c.course_code.startsWith(termYearCode),
  );
}

// classmate mapping
async function getClassmates(termYearCode) {
  // get all courses
  const courses = await canvasGet("/courses");
  console.log(
    "All courses:",
    courses.map((c) => ({ id: c.id, code: c.course_code, name: c.name })),
  );

  // filter by term/year
  console.log("Filtering for term:", termYearCode);
  courses.forEach((c) => console.log(c.id, c.course_code, c.name));
  const filteredCourses = courses.filter(
    (c) => c.name && c.name.includes(termYearCode),
  );

  const commonMap = new Map();
  const self = await canvasGet("/users/self");
  const selfUserId = self.id;

  // loop through only filtered courses
  for (const course of filteredCourses) {
    const users = await canvasGet(
      `/courses/${course.id}/users?enrollment_type[]=student&per_page=100`,
    );
    if (!Array.isArray(users)) continue;

    for (const user of users) {
      if (user.id === selfUserId) continue;

      if (!commonMap.has(user.id)) {
        commonMap.set(user.id, { name: user.name, courses: [course.name] });
      } else {
        commonMap.get(user.id).courses.push(course.name);
      }
    }
  }

  // convert map to array
  return Array.from(commonMap.entries())
    .map(([userId, info]) => ({
      userId,
      name: info.name,
      sharedCourses: info.courses,
      sharedCount: info.courses.length,
    }))
    .filter((c) => c.sharedCount > 1) // ❌ remove people with only 1 shared class
    .sort((a, b) => b.sharedCount - a.sharedCount); // sort descending
}

module.exports = { getClassmates };
