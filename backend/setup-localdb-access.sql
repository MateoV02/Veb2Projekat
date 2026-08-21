-- Service Fabric pokreće servise pod nalogom NT AUTHORITY\NETWORK SERVICE, koji nema
-- pristup LocalDB instanci po difoltu. Ovaj skript to dodeljuje.
-- Pokreni preko: sqlcmd -S "(localdb)\.\TripPlannerShared" -i setup-localdb-access.sql
-- (prethodno mora biti podeljena instanca, vidi README -> Pokretanje -> Backend)

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'NT AUTHORITY\NETWORK SERVICE')
BEGIN
    CREATE LOGIN [NT AUTHORITY\NETWORK SERVICE] FROM WINDOWS;
END
ALTER SERVER ROLE sysadmin ADD MEMBER [NT AUTHORITY\NETWORK SERVICE];
