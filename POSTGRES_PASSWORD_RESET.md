# PostgreSQL Password Reset Guide

## If you forgot your PostgreSQL password, follow these steps:

### Method 1: Reset via pgAdmin
1. Open pgAdmin 4
2. If it connects without asking password → Your password might be saved
3. Right-click "PostgreSQL 18" → Properties
4. Note the password or reset it

### Method 2: Reset via Command Line
1. Stop PostgreSQL service:
   ```powershell
   Stop-Service postgresql-x64-18
   ```

2. Edit pg_hba.conf:
   - Location: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
   - Change line: `host    all    all    127.0.0.1/32    scram-sha-256`
   - To: `host    all    all    127.0.0.1/32    trust`
   - Save file

3. Start PostgreSQL:
   ```powershell
   Start-Service postgresql-x64-18
   ```

4. Connect without password:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
   ```

5. Change password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'newpassword';
   ```

6. Revert pg_hba.conf changes (change trust back to scram-sha-256)

7. Restart PostgreSQL

### Method 3: Check Saved Password in pgAdmin
1. Open pgAdmin
2. File → Preferences → Paths → Binary paths
3. Check if password is saved

### Method 4: Use Alternative Database
Instead of postgres, create a new superuser:
```sql
CREATE USER sgms_admin WITH PASSWORD 'sgms123' SUPERUSER;
```

Then in backend/.env:
```
DB_USER=sgms_admin
DB_PASSWORD=sgms123
```
