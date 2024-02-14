--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE passes (
  id              INTEGER PRIMARY KEY,
  student_id      NOT NULL REFERENCES students(id),
  source_id       NOT NULL REFERENCES locations(id),
  destination_id  NOT NULL REFERENCES locations(id),
  start_time      TEXT NOT NULL,
  end_time        TEXT
);

INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-14T00:16:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-14T00:16:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-11T00:16:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-14T00:16:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-14T00:16:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-14T00:18:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-17T00:16:00Z');
INSERT INTO passes (student_id, source_id, destination_id, start_time) VALUES (1, 1, 1, '2023-02-13T00:16:00Z');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE passes;
