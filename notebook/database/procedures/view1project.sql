CREATE PROCEDURE ViewProject
    @ProjectID INT
AS
BEGIN
    SELECT * FROM Project
    WHERE ProjectID = @ProjectID;
END;
