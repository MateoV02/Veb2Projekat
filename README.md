# Trip Planner

Web aplikacija za planiranje putovanja — projekat iz predmeta *Primena veb programiranja u infrastrukturnim sistemima*.

## Arhitektura

Backend je organizovan kao **Service Fabric** aplikacija sa 4 mikroservisa, svaki sa sopstvenom bazom (database-per-service):

| Servis | Tip | Odgovornost | Baza | Port (lokalno) |
|---|---|---|---|---|
| **IdentityService** | stateless | registracija, login, JWT, uloge (user/admin) | `IdentityDb` | 8081 |
| **TripService** | stateless | planovi putovanja, destinacije, aktivnosti/kalendar, checklist, napomene | `TripDb` | 8082 |
| **ExpenseService** | stateless | troškovi, kategorije, obračun budžeta | `ExpenseDb` | 8083 |
| **SharingService** | **stateful** | generisanje/validacija VIEW/EDIT share tokena preko Reliable Dictionary | — (Reliable Collections) | 8084 |

Frontend (React + TypeScript) komunicira direktno sa svakim servisom preko REST API-ja; svi URL-ovi su u `.env` fajlu (nikad hardkodovani).

```
frontend (React)  --http-->  IdentityService (8081)
                  --http-->  TripService     (8082)
                  --http-->  ExpenseService  (8083)
                  --http-->  SharingService  (8084, stateful)
```

## Tehnologije

**Backend**
- Microsoft Service Fabric (lokalni klaster za razvoj)
- ASP.NET Core Web API na .NET 8, hostovan preko Kestrel-a unutar Service Fabric procesa
- Entity Framework Core (Code-First migracije) — dodaje se od 2. dela
- Microsoft SQL Server (LocalDB za razvoj)
- JWT autentikacija — dodaje se od 3. dela

**Frontend**
- React 19 + TypeScript, build alat Vite
- React Router (rute po stranicama)
- Axios — HTTP pozivi isključivo kroz `src/services/*`, nikad direktno u komponentama
- Context API za globalno stanje — dodaje se od 4. dela

## Struktura repozitorijuma

```
backend/
  TripPlanner.sln              Visual Studio solution
  TripPlannerApp/               Service Fabric Application projekat (.sfproj)
  IdentityService/               stateless servis
  TripService/                   stateless servis
  ExpenseService/                stateless servis
  SharingService/                stateful servis
frontend/
  src/
    api/          axios instance-i po servisu (čitaju URL iz .env)
    services/      funkcije koje pozivaju backend (koriste ih komponente)
    models/        TypeScript tipovi
    components/    UI komponente, organizovane po feature-u
    pages/         stranice
```

## Pokretanje

### Preduslovi
- Visual Studio 2022 sa Service Fabric SDK i runtime-om (`C:\Program Files\Microsoft SDKs\Service Fabric` mora postojati)
- Node.js 18+
- SQL Server LocalDB
- `dotnet-ef` alat (`dotnet tool install --global dotnet-ef`) — ako migracije radiš iz komandne linije umesto Package Manager Console-e

### Backend
1. **Pokreni Visual Studio kao administrator** (desni klik → Run as administrator) — lokalni Service Fabric klaster (`FabricHostSvc`) zahteva admin prava da bi se pokrenuo
2. Otvori `backend\TripPlanner.sln`
3. Pri prvom otvaranju Visual Studio može da prikaže dijalog *"The project 'TripPlannerApp' has incompatible NuGet package installed..."* — klikni **Yes** (instalira `Microsoft.VisualStudio.Azure.Fabric.MSBuild`, neophodan za build)
4. Kreiraj bazu za IdentityService (Package Manager Console, default project = `IdentityService`):
   ```
   Update-Database
   ```
   ili iz komandne linije, iz foldera `backend\IdentityService`:
   ```bash
   dotnet ef database update
   ```
5. **Podeli LocalDB instancu i dodaj pristup** (jednokratno, obavezno — inače servisi ne mogu da se povežu na bazu jer Service Fabric pokreće servise pod nalogom `NT AUTHORITY\NETWORK SERVICE`, koji nema pristup tvojoj LocalDB instanci po difoltu):
   - U **administratorskom** PowerShell-u/cmd-u:
     ```powershell
     sqllocaldb share MSSQLLocalDB TripPlannerShared
     ```
   - Zatim (ne mora admin):
     ```bash
     sqlcmd -S "(localdb)\.\TripPlannerShared" -i backend\setup-localdb-access.sql
     ```
6. Postavi `TripPlannerApp` kao startup projekat
7. Ctrl+F5 (ili dugme Start) — Visual Studio će podesiti/pokrenuti lokalni Service Fabric klaster i deploy-ovati aplikaciju (prvi put može da potraje par minuta)
8. Provera: `http://localhost:8081/api/identity/health` treba da vrati `{"status":"ok","service":"IdentityService"}` (isto za 8082/trips, 8083/expenses, 8084/sharing)

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Aplikacija je na `http://localhost:5173`. Početna stranica prikazuje status sva 4 backend servisa.

## Dnevnik razvoja (po delovima)

### Deo 1 — Inicijalizacija i skeleton
- Kreirana Service Fabric solution struktura: `TripPlannerApp` (Application projekat) + 4 servisa (`IdentityService`, `TripService`, `ExpenseService` — stateless; `SharingService` — stateful)
- Svaki servis ima minimalan `/health` endpoint i CORS podešen za frontend
- `nuget.config` dodat sa lokalnim SDK paket izvorom (paketi verzije `8.7.157` postoje samo lokalno u SDK folderu, ne na nuget.org)
- `TripPlannerApp` projekat zahteva klasični NuGet paket `Microsoft.VisualStudio.Azure.Fabric.MSBuild` (restauriran preko `packages.config`, folder `backend/packages/` je namerno u `.gitignore`) — Visual Studio ga sam ponudi da instalira pri prvom otvaranju rešenja (dijalog "incompatible NuGet package" → Yes)
- Cela solucija testirana i uspešno se builda i preko Visual Studio-a i preko MSBuild-a iz komandne linije (`Build succeeded. 0 Error(s)`) — potvrđeno da se sva 4 servisa i Application projekat kompajliraju čisto
- React + TypeScript frontend inicijalizovan preko Vite-a; podešen sloj `api/` (axios instance-i po servisu) i `services/` (funkcije koje komponente pozivaju — HTTP pozivi nikad direktno u komponentama)
- Početna stranica (`HomePage`) proverava dostupnost sva 4 backend servisa i prikazuje status — testirano uživo u browseru (svi servisi ispravno prikazuju "nedostupan" jer backend još nije pokrenut lokalno)
- `.env.example` sa URL-ovima sva 4 servisa
- Dodat `Deploy.0` unos u `.sln` za `TripPlannerApp` (bez njega F5/Start u Visual Studio-u ne deploy-uje aplikaciju na klaster, samo je builda)
- Potvrđen pun end-to-end tok na lokalnom klasteru: Visual Studio pokrenut kao administrator (`FabricHostSvc` zahteva admin prava) → deploy uspešan → sva 4 `/health` endpointa vraćaju ispravan odgovor

### Deo 2 — Baza i migracije za IdentityService
- Dodati EF Core paketi (`Microsoft.EntityFrameworkCore.SqlServer`, `.Design`) i `AutoMapper` u `IdentityService.csproj`
- `Models/User.cs` (DB entitet) i `Models/UserRole.cs` (enum: User/Admin) — odvojeno od `Dtos/UserDto.cs` (DTO nikad ne izlaže `PasswordHash`), mapiranje kroz `Mapping/MappingProfile.cs` (AutoMapper)
- `Data/IdentityDbContext.cs` — konfiguracija: email je jedinstven (`HasIndex().IsUnique()`), max dužine polja, rola se čuva kao string
- `Data/IdentityDbContextFactory.cs` — `IDesignTimeDbContextFactory`, potreban da `dotnet ef` može da napravi migraciju bez pokretanja Service Fabric runtime-a (`Program.Main` zahteva pravi Fabric kontekst koji `dotnet ef` alat nema)
- `appsettings.json` sa connection string-om ka `IdentityDb` (LocalDB); servis ga učitava kroz `ConfigureAppConfiguration` u `IdentityService.cs`
- Kreirana početna migracija (`Migrations/InitialCreate`) i **testirana uživo** — `dotnet ef database update` je stvarno napravio `IdentityDb` bazu i `Users` tabelu na LocalDB (potvrđeno preko `sqlcmd`)

### Deo 3 — Registracija, login, JWT i autorizacija
- `Dtos/RegisterRequestDto.cs`, `LoginRequestDto.cs`, `AuthResponseDto.cs` — validacija preko data annotations (`[Required]`, `[EmailAddress]`, `[MinLength(6)]` za lozinku)
- `Services/JwtTokenService.cs` — generiše JWT (claims: sub, email, name, role), potpisan HMAC SHA256 ključem iz `appsettings.json` (`Jwt` sekcija: Key/Issuer/Audience/ExpiryMinutes — isti ključ će koristiti i ostali servisi da validiraju token bez pozivanja IdentityService-a)
- `Services/UserService.cs` — registracija (BCrypt heširanje lozinke, provera duplikata email-a → `EmailAlreadyExistsException` → 409) i login (BCrypt.Verify, generički "pogrešan email ili lozinka" odgovor da se ne otkriva da li email postoji → 401)
- `AuthController` (`POST /api/identity/auth/register`, `POST /api/identity/auth/login`) i `UsersController` (`GET /api/identity/users/me` — bilo koji ulogovan korisnik, `GET /api/identity/users` — `[Authorize(Roles = "Admin")]`) — demonstrira role-based autorizaciju
- JWT Bearer autentikacija podešena u `Startup.cs` (`ValidateIssuer`, `ValidateAudience`, `ValidateLifetime`, `ValidateIssuerSigningKey` — svi uključeni)
- **Otkriven i rešen važan environment problem**: Service Fabric pokreće servise pod nalogom `NT AUTHORITY\NETWORK SERVICE`, koji nema pristup LocalDB instanci vezanoj za razvojni Windows nalog. Rešenje (dokumentovano u README → Pokretanje → Backend, korak 5, i `backend/setup-localdb-access.sql`): deljenje LocalDB instance (`sqllocaldb share`) + SQL login za `NETWORK SERVICE`. Ovo je jednokratan korak potreban svakom ko pokreće projekat.
- **Testirano uživo end-to-end** preko redeploy-a na lokalni klaster: register (201) → duplikat email (409) → pogrešna lozinka (401) → login (200, ispravan JWT) → `/users/me` bez tokena (401) → sa tokenom (200) → `/users` kao obična uloga (403) → isti korisnik promovisan u Admin-a u bazi → `/users` sada vraća listu (200)
- Sitna popravka: `UserRole` enum se po difoltu serijalizovao kao broj (`0`/`1`) u JSON-u — dodat `JsonStringEnumConverter` u `Startup.cs` da API vraća čitljivo `"User"`/`"Admin"`

### Deo 4 — Frontend autentikacija
- `models/Auth.ts` — TypeScript tipovi koji odgovaraju backend DTO-ima (`User`, `AuthResponse`, `RegisterRequest`, `LoginRequest`)
- `services/identityService.ts` proširen sa `register`, `login`, `getCurrentUser` (HTTP pozivi i dalje isključivo u servisnom sloju)
- `context/AuthContext.tsx` — Context API (`AuthProvider`/`useAuth`), token se čuva u `localStorage`; pri pokretanju aplikacije poziva `/users/me` da obnovi sesiju i proveri da token još važi (ako ne, briše ga)
- `components/routing/ProtectedRoute.tsx` — preusmerava na `/login` ako korisnik nije ulogovan
- `pages/LoginPage.tsx` i `RegisterPage.tsx` — forme sa validacijom (frontend + prikaz grešaka sa backend-a preko `utils/errors.ts`)
- `HomePage` sada zaštićena (`ProtectedRoute`), prikazuje ime/ulogu ulogovanog korisnika i dugme za odjavu
- **Testirano uživo u browseru** (frontend + realan backend na lokalnom klasteru): registracija kroz formu → auto-login → dashboard prikazuje ime i ulogu ("User") → refresh stranice zadržava sesiju (poziv `/users/me`) → odjava briše token i vraća na `/login` → pogrešna lozinka na login formi ispravno prikazuje "Pogrešan email ili lozinka."
