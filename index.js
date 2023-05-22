require('dotenv');
const { Octokit, App } = require("octokit");
const fs = require('fs');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = 'metabase';
const REPO = 'metabase';

const start = async (ref) => {
  const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/check-runs', {
    owner: OWNER,
    repo: REPO,
    ref: ref,
  });

  const checkRuns = response.data.check_runs.map(formatCheckRun);

  fs.writeFileSync(`debug_${ref}_${new Date().toISOString()}.json`, JSON.stringify(checkRuns, null, 2));
};

const formatCheckRun = (checkRun) => ({
  name: checkRun.name,
  status: checkRun.status,
  conclusion: checkRun.conclusion,
  started_at: checkRun.started_at,
  completed_at: checkRun.completed_at,
});

start('246d1eecbd35dbedb97340285b4b3b0e5ee507a2');
