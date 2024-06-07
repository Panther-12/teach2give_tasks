CREATE PROCEDURE LoginUser
    @UserEmail VARCHAR(100),
    @Password VARCHAR(255)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM [User] WHERE UserEmail = @UserEmail AND Password = @Password)
    BEGIN
        SELECT UserID, UserName, UserEmail, RoleID
        FROM [User]
        WHERE UserEmail = @UserEmail AND Password = @Password;
    END
    ELSE
    BEGIN
        PRINT 'Invalid email or password.';
    END
END
