CREATE PROCEDURE ViewAllUnassignedProjects
AS
BEGIN
    SELECT * FROM Project
    WHERE ProjectID NOT IN (SELECT ProjectID FROM Assignment);
END;
