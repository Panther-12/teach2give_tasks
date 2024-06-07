CREATE PROCEDURE DeleteProject
    @ProjectID INT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM Assignment WHERE ProjectID = @ProjectID;
        DELETE FROM Project WHERE ProjectID = @ProjectID;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
