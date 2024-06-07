--User views project assigned
CREATE PROCEDURE ViewAssignedProject
    @UserID INT
AS
BEGIN
    SELECT p.ProjectName, p.ProjectDescription, p.EndDate, ps.StatusName
    FROM Project p
    JOIN Assignment a ON p.ProjectID = a.ProjectID
    JOIN ProjectStatus ps ON p.StatusID = ps.StatusID
    WHERE a.UserID = @UserID;
END
