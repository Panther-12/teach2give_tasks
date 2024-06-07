use Notebook;

CREATE PROCEDURE getNoteById
    @NoteID VARCHAR(255)
AS
BEGIN
    SELECT *
    FROM Notebook
    WHERE NoteID = @NoteID;
END