CREATE PROCEDURE updateProject
    @ProjectID BIGINT,
    @ProjectName VARCHAR(100),
    @ProjectDescription VARCHAR(255),
    @EndDate DATE,
    @StatusID INT
AS
BEGIN
    UPDATE Project
    SET ProjectName = @ProjectName,
        ProjectDescription = @ProjectDescription,
        EndDate = @EndDate,
        StatusID = @StatusID
    WHERE ProjectID = @ProjectID;
END;