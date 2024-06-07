use Notebook;

CREATE PROCEDURE deleteNote
    @NoteID VARCHAR(255)
AS
BEGIN
    DELETE FROM Notebook
    WHERE NoteID = @NoteID;
END