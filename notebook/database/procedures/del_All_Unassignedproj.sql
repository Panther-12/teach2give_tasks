CREATE PROCEDURE DeleteAllUnassignedProjects
AS
BEGIN
    DELETE FROM Project
    WHERE ProjectID NOT IN (SELECT ProjectID FROM Assignment);
END;
