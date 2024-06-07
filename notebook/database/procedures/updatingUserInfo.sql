CREATE PROCEDURE UpdateUserProfile
    @UserID INT,
    @UserName VARCHAR(100) = NULL,
    @UserEmail VARCHAR(100) = NULL,
    @Password VARCHAR(255) = NULL,
    @RoleID INT = NULL
AS
BEGIN
    UPDATE User_
    SET 
        UserName = COALESCE(@UserName, UserName),
        UserEmail = COALESCE(@UserEmail, UserEmail),
        Password = COALESCE(@Password, Password),
        RoleID = COALESCE(@RoleID, RoleID)
    WHERE UserID = @UserID;
END;
