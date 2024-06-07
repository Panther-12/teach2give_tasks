CREATE PROCEDURE AddNote
    @NoteName VARCHAR(100),
    @NoteDescription VARCHAR(255),
    @EndDate DATE
AS
BEGIN
    INSERT INTO Note (NoteName, NoteDescription, EndDate)
    VALUES (@NoteName, @NoteDescription, @EndDate);
END
