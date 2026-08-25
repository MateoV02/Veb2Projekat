# Trip Planner

Projekat za predmet Primena veb programiranja u infrastrukturnim sistemima(PUGS).

Web aplikacija za planiranje putovanja - korisnik moze da napravi plan putovanja, doda destinacije, planira aktivnosti po danima (kalendar), vodi evidenciju troskova i budzeta, pravi checklistu za pakovanje i dijeli plan sa drugima preko QR koda / linka.

## Sta je koristeno od tehnologija:

### Frontend
- React + TypeScript (Vite)
- React Router
- Context API (auth + toast notifikacije)
- Axios

### Backend
- ASP.NET Core 8 (Web API)
- Microsoft Service Fabric (mikroservisna arhitektura, lokalni klaster)
- Entity Framework Core (Code First, migracije)
- Microsoft SQL Server (LocalDB)
- JWT autentikacija + BCrypt hesiranje lozinki
- AutoMapper
- QRCoder (generisanje QR koda)

## Arhitektura

Backend je podjeljen na 4 mikroservisa, svaki sa svojom ulogom:

|      Servis 	  | Port |    Tip    |    Uloga                                              |
|-----------------|------|-----------|--------------------------------------------------------|
| IdentityService | 8081 | stateless | registracija, login, JWT, uloge                       |
| TripService     | 8082 | stateless | planovi putovanja, destinacije, aktivnosti, checklist |
| ExpenseService  | 8083 | stateless | troskovi, budzet                                      |
| SharingService  | 8084 | stateful  | QR kod / share linkovi (Reliable Dictionary)          |

*Vizuelan prikaz u folderu dijagrami!

## Pokretanje

Preduslovi

- Visual Studio 2022 sa Service Fabric SDK/tools
- .NET 8 SDK
- SQL Server Express LocalDB
- Node.js (18+)

### Backend

1. Podjeliti LocalDB instancu (potrebno je da Service Fabric servisi mogu da joj pristupe), pokrenuti u PowerShell-u (obicna instanca `MSSQLLocalDB` obicno vec postoji po defaultu):
   komande:
   ```
   sqllocaldb share MSSQLLocalDB TripPlannerShared
   sqllocaldb start MSSQLLocalDB
   ```
2. Dojdeliti pristup bazi nalogu pod kojim rade Service Fabric servisi:
   ```
   sqlcmd -S "(localdb)\.\TripPlannerShared" -i backend/setup-localdb-access.sql
   ```
3. Otvoriti "backend/TripPlanner.sln" u Visual Studio-u (**pokrenuti Visual Studio kao administrator** - Service Fabric lokalni klaster to zahteva).

4. Za svaki servis (IdentityService, TripService, ExpenseService, SharingService) pokrenuti migracije da se naprave baze:
   ```
   cd backend/<Servis>
   dotnet ef database update
   ```

5. Postaviti "TripPlannerApp" kao startup project i pokrenuti (F5 ili zelena strelica start). Visual Studio ce deploy-ovati aplikaciju na lokalni
   Service Fabric klaster.

Nakon pokretanja servisi su dostupni na portovima iz tabele iznad (npr. "http://localhost:8081/api/...").

Migracija "SeedAdminUser" automatski ubacuje admin nalog:
- email: "admin@gmail.com"
- lozinka: "admin123"

### Frontend

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

Aplikacija se pokrece na "http://localhost:5173". ".env" fajl sadrzi URL-ove backend servisa (vec podeseni na default portove iz tabele).

## Napomene

- Svaki servis ima svoju bazu (IdentityDb, TripDb, ExpenseDb) - database-per-service pristup, ne dele podatke direktno nego preko REST poziva.
- SharingService nema SQL bazu, share tokeni se cuvaju u memoriji preko Reliable Dictionary (Service Fabric).
- LocalDB se ugasi kad je duze vreme neaktivan - ako backend baca greske pri konekciji na bazu, pokrenuti ponovo sa "sqllocaldb start MSSQLLocalDB".
