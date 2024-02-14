--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE locations (
  id    INTEGER PRIMARY KEY,
  name  TEXT,
  icon  TEXT
);

INSERT INTO locations (name, icon) VALUES ('main office', 'home');
INSERT INTO locations (name, icon) VALUES ('bathroom', 'wc');
INSERT INTO locations (name, icon) VALUES ('room 182', 'meeting_room');
INSERT INTO locations (name, icon) VALUES ('room 138', 'meeting_room');
INSERT INTO locations (name, icon) VALUES ('water fountain', 'water_drop');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE locations;
