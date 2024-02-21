--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE passes (
  id               INTEGER PRIMARY KEY,
  student_id       NOT NULL REFERENCES students(id),
  source_id        NOT NULL REFERENCES locations(id),
  destination_id   NOT NULL REFERENCES locations(id),
  start_time       TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  end_time         TEXT
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE passes;
