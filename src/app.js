const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");

dotenv.config("./.env");

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
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

// get user terms
async function getTerms() {
  const courses = await canvasGet("/courses?include[]=term");
  if (!Array.isArray(courses)) return [];

  const termsMap = new Map();
  courses.forEach((c) => {
    if (c.term) {
      termsMap.set(c.term.id, {
        id: c.term.id,
        name: c.term.name,
      });
    }
  });

  return Array.from(termsMap.values());
}

// classmate mapping
async function getClassmates(termYearCode) {
  // get all courses
  const allCourses = await canvasGet(
    `/courses?enrollment_term_id=${termYearCode}&per_page=100`,
  );
  if (!Array.isArray(allCourses) || allCourses.length === 0) {
    console.log("No active courses found for this term.");
    return [];
  }

  const courses = allCourses.filter(
    (c) => String(c.enrollment_term_id) === String(termYearCode),
  );
  console.log(`Found ${courses.length} courses for Term ID ${termYearCode}`);

  const commonMap = new Map();
  const self = await canvasGet("/users/self");
  const selfUserId = self.id;

  await Promise.all(
    courses.map(async (course) => {
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
          if (!commonMap.get(user.id).courses.includes(course.name)) {
            commonMap.get(user.id).courses.push(course.name);
          }
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
    .sort((a, b) => b.sharedCount - a.sharedCount);
}

module.exports = { getClassmates, getTerms };
