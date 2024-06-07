use Notebook;

CREATE PROCEDURE AddNote
    @NoteID VARCHAR(255),
    @NoteTitle VARCHAR(100),
    @NoteContent VARCHAR(255),
    @CreatedAt DATE
AS
BEGIN
    INSERT INTO Notebook (NoteID, NoteTitle, NoteContent, CreatedAt)
    VALUES (@NoteID, @NoteTitle, @NoteContent, @CreatedAt);
END
