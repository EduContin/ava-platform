/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.createTable("pinned", {
    id: "id",
    user_id: { type: "integer", notNull: true, references: "users" },
    thread_id: {
      type: "integer",
      notNull: true,
      references: "threads",
      onDelete: "CASCADE", // Add this line
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  //Alow us to not let a user pin a thread more than once and get
  //all of his threads
  pgm.addConstraint("pinned", "unique_user_thread_pin", {
    unique: ["user_id", "thread_id"],
  });
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
// eslint-disable-next-line no-unused-vars
exports.down = (pgm) => {};