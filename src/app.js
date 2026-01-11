const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");

dotenv.config("/src/.env");

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
    (c) => typeof c.name === "string" && c.name.includes(`${termYearCode}`),
  );
}

// classmate mapping
async function getClassmates(termYearCode) {
  // get all courses
  const courses = await canvasGet(
    `/courses?enrollment_state=active&enrollment_term_id=sis_term_id:${termYearCode}&include[]=term`,
  );
  console.log(
    "All courses:",
    courses.map((c) => ({ id: c.id, code: c.course_code, name: c.name })),
  );

  // filter by term/year
  console.log("Filtering for term:", termYearCode);
  courses.forEach((c) => console.log(c.id, c.course_code, c.name));
  const filteredCourses = filterCoursesByTerm(courses, termYearCode);

  const commonMap = new Map();
  const self = await canvasGet("/users/self");
  const selfUserId = self.id;

  await Promise.all(
    filteredCourses.map(async (course) => {
      const users = await canvasGet(
        `/courses/${course.id}/users?enrollment_type[]=student&per_page=100`,
      );
      if (!Array.isArray(users)) return;

      users.forEach((user) => {
        if (user.id === selfUserId) return;
        if (!commonMap.has(user.id)) {
          commonMap.set(user.id, {
            name: user.name,
            courses: [course.name],
          });
        } else {
          commonMap.get(user.id).courses.push(course.name);
        }
      });
    }),
  );

  // convert map to array
  return Array.from(commonMap.entries())
    .map(([userId, info]) => ({
      userId,
      name: info.name,
      sharedCourses: info.courses,
      sharedCount: info.courses.length,
    }))
    .sort((a, b) => b.sharedCount - a.sharedCount); // sort descending
  // .filter((c) => c.sharedCount > 1) // remove people with only 1 shared class
}

module.exports = { getClassmates };
