--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE students (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL
);

INSERT INTO students (name) VALUES ('student 1');
INSERT INTO students (name) VALUES ('student 2');
INSERT INTO students (name) VALUES ('student 3');
INSERT INTO students (name) VALUES ('student 4');
INSERT INTO students (name) VALUES ('student 5');
INSERT INTO students (name) VALUES ('student 6');
INSERT INTO students (name) VALUES ('student 7');
INSERT INTO students (name) VALUES ('student 8');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE students;
