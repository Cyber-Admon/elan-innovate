/*
  Prints every row in the applications table.
  Run from the project root with:
    node --env-file=.env.local scripts/check-db.mjs
*/

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Did you run this with --env-file=.env.local from the project root?"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error, count } = await supabase
  .from("applications")
  .select("*", { count: "exact" })
  .order("created_at", { ascending: false });

if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

console.log(`\nTotal applications: ${count}\n`);

if (!data.length) {
  console.log("Table is empty. Nothing has been submitted yet.\n");
  process.exit(0);
}

for (const row of data) {
  console.log("-".repeat(60));
  console.log(`Submitted:  ${new Date(row.created_at).toLocaleString()}`);
  console.log(`Track:      ${row.track}`);
  console.log(`Name:       ${row.full_name}`);
  console.log(`Email:      ${row.email}`);
  console.log(`Phone:      ${row.phone}`);
  console.log(`Campus:     ${row.campus ?? "not given"}`);
  console.log(`Idea:       ${row.idea_name}`);
  console.log(`One liner:  ${row.one_liner}`);
  console.log(`Stage:      ${row.stage}`);
  console.log(`Problem:    ${row.problem}`);
  console.log(`Why:        ${row.why}`);

  if (Array.isArray(row.team) && row.team.length) {
    console.log(`Team:       ${row.team.length} member(s)`);
    row.team.forEach((member, i) => {
      console.log(
        `  ${i + 1}. ${member.name} | ${member.email} | ${member.phone} | ${
          member.isStudent ? "student" : "not a student"
        } | ${member.skills}`
      );
    });
  } else {
    console.log("Team:       solo");
  }
}

console.log("-".repeat(60) + "\n");