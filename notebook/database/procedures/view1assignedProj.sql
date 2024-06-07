CREATE PROCEDURE ViewAssignedProject
    @AssignmentID INT
AS
BEGIN
    SELECT * FROM Assignment
    WHERE AssignmentID = @AssignmentID;
END;
