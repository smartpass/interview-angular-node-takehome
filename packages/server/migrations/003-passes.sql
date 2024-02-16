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

INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes, end_time) VALUES (1, 1, 1, '2023-02-14T00:16:00Z', 10, '2023-02-14T00:18:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes, end_time) VALUES (2, 1, 1, '2023-02-14T13:02:00Z', 10, '2023-02-14T13:04:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (3, 1, 1, '2023-02-14T00:16:00Z', 10);
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (4, 1, 1, '2023-02-11T00:16:00Z', 10);
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (5, 1, 1, '2023-02-14T00:16:00Z', 10);
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (6, 1, 1, '2023-02-14T00:16:00Z', 10);
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (7, 1, 1, strftime('%Y-%m-%dT%H:%M:%fZ','now'), 1);
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (9, 1, 1, strftime('%Y-%m-%dT%H:%M:%fZ','now'), 5);
INSERT INTO passes (student_id, source_id, destination_id, start_time, duration_minutes) VALUES (9, 1, 1, strftime('%Y-%m-%dT%H:%M:%fZ','now'), 10);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE passes;
