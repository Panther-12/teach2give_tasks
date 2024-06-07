CREATE PROCEDURE DeleteUnassignedProject
    @ProjectID INT
AS
BEGIN
    DELETE FROM Project
    WHERE ProjectID = @ProjectID
    AND ProjectID NOT IN (SELECT ProjectID FROM Assignment);
END;
