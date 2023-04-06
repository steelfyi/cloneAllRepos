const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const axios = require("axios");
const git = simpleGit();

require("dotenv").config();

const user = "steelfyi";
const token = process.env.GITHUB_API_TOKEN;

const baseURL = `https://${user}:${token}@github.com/`;

const saveDirectory = path.join(__dirname, "your-repos-folder");

fs.mkdirSync(saveDirectory, { recursive: true });

axios
  .get(`https://api.github.com/users/${user}/repos?per_page=100`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${token}`,
    },
  })
  .then((response) => {
    const repos = response.data;
    repos.forEach((repo) => {
      const repoURL = baseURL + repo.full_name;
      const repoPath = path.join(saveDirectory, repo.name);
      git.clone(repoURL, repoPath, (cloneErr) => {
        if (cloneErr) {
          console.error(`Error cloning ${repo.name}:`, cloneErr);
        } else {
          console.log(`Successfully cloned ${repo.name}`);
        }
      });
    });
  })
  .catch((err) => {
    console.error("Error fetching repos:", err);
  });
