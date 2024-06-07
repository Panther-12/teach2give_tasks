use Notebook;

CREATE TABLE Notebook (
    NoteID VARCHAR(255) PRIMARY KEY,
    NoteTitle VARCHAR(100) NOT NULL,
    NoteContent VARCHAR(255) NOT NULL,
    CreatedAt DATE DEFAULT (GETDATE()) NOT NULL,
)