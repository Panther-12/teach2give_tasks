CREATE TABLE Project (
    ProjectID BIGINT IDENTITY(1,1) PRIMARY KEY,
    ProjectName VARCHAR(100) NOT NULL,
    ProjectDescription VARCHAR(255) NOT NULL,
    EndDate DATE NOT NULL,
    StatusID INT NOT NULL,
    FOREIGN KEY (StatusID) REFERENCES ProjectStatus(StatusID)
)