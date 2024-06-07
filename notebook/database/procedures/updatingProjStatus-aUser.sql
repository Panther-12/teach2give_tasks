CREATE PROCEDURE UpdateProjectStatusForUser
    @UserID INT,
    @StatusID INT
AS
BEGIN
    UPDATE Project
    SET StatusID = @StatusID
    WHERE ProjectID IN (SELECT ProjectID FROM Assignment WHERE UserID = @UserID);
END;
