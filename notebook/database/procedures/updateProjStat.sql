CREATE PROCEDURE UpdateProjectStatus
    @ProjectID INT,
    @StatusName VARCHAR(50)
AS
BEGIN
    DECLARE @StatusID INT;
    SET @StatusID = (SELECT StatusID FROM ProjectStatus WHERE StatusName = @StatusName);

    IF @StatusID IS NOT NULL
    BEGIN
        UPDATE Project
        SET StatusID = @StatusID
        WHERE ProjectID = @ProjectID;
    END
    ELSE
    BEGIN
        PRINT 'Invalid status name.';
    END
END
