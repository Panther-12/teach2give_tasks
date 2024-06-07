CREATE PROCEDURE RegisterUser
    @UserName VARCHAR(100),
    @UserEmail VARCHAR(100),
    @Password VARCHAR(255),
    @Phone_number VARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [User_] WHERE UserEmail = @UserEmail)
    BEGIN
        INSERT INTO [User_] (UserName, UserEmail, Password, Phone_number)
        VALUES (@UserName, @UserEmail, @Password, @Phone_number);
    END
    ELSE
    BEGIN
        PRINT 'Email already exists.';
    END
END
