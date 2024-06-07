CREATE PROCEDURE ViewUnassignedProject
    @ProjectID INT
AS
BEGIN
    SELECT * FROM Project
    WHERE ProjectID = @ProjectID
    AND ProjectID NOT IN (SELECT ProjectID FROM Assignment);
END;
