// MIGRATION_NAME=addRoleProperty npm run dev-migration
// node index.js addRoleProperty
const migrationName = process.env.MIGRATION_NAME

if (!migrationName) {
  throw new Error("Please provide a migration name in env.MIGRATION_NAME")
}

require("./" + migrationName)