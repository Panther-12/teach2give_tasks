use Notebook;

CREATE PROCEDURE fetchAllNotes
AS
BEGIN
    SELECT *
    FROM Notebook;
END