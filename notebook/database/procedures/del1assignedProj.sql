CREATE PROCEDURE DeleteAssignedProject
    @AssignmentID INT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM Assignment WHERE AssignmentID = @AssignmentID;
        DELETE FROM Project WHERE ProjectID = (SELECT ProjectID FROM Assignment WHERE AssignmentID = @AssignmentID);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
