CREATE PROCEDURE AssignProject
    @UserID INT,
    @ProjectID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Assignment WHERE UserID = @UserID)
    BEGIN
        INSERT INTO Assignment (UserID, ProjectID, AssignedDate)
        VALUES (@UserID, @ProjectID, GETDATE());

        -- Logic to send email to user can be handled in the application layer
    END
    ELSE
    BEGIN
        PRINT 'User is already assigned to a project.';
    END
END
