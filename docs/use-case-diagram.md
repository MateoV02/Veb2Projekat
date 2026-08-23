# Use Case dijagram — Trip Planner

Dva aktera: **Korisnik** (registrovan korisnik aplikacije) i **Admin** (proširuje sve mogućnosti Korisnika). Treći, neformalni akter je **Gost preko deljenog linka** — osoba bez naloga koja pristupa planu putovanja preko QR koda/linka.

```mermaid
flowchart LR
    User(["Korisnik"])
    Admin(["Admin"])
    Guest(["Gost (deljeni link)"])

    subgraph Auth["Autentikacija"]
        UC1(("Registracija"))
        UC2(("Prijava"))
    end

    subgraph Trips["Planovi putovanja"]
        UC3(("Kreiranje plana putovanja"))
        UC4(("Pregled/izmena/brisanje plana"))
        UC5(("Upravljanje destinacijama"))
        UC6(("Upravljanje aktivnostima<br/>+ kalendarski prikaz"))
        UC7(("Checklist / packing lista"))
    end

    subgraph Budget["Troškovi"]
        UC8(("Evidencija troškova po kategorijama"))
        UC9(("Pregled preostalog budžeta"))
    end

    subgraph Share["Deljenje"]
        UC10(("Generisanje QR/link za deljenje<br/>VIEW ili EDIT"))
        UC11(("Opoziv deljenog linka"))
        UC12(("Pregled deljenog plana"))
        UC13(("Izmena deljenog plana<br/>(samo uz EDIT pristup)"))
    end

    subgraph AdminOnly["Administracija"]
        UC14(("Pregled svih korisnika"))
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11

    Admin -.->|nasleđuje sve od Korisnika| User
    Admin --> UC14

    Guest --> UC12
    Guest --> UC13
```

## Kratak opis ključnih use case-ova

| Use case | Akter | Napomena |
|---|---|---|
| Registracija / Prijava | Korisnik | Lozinka heširana (BCrypt), JWT token po uspešnoj prijavi |
| Kreiranje/izmena/brisanje plana putovanja | Korisnik | Validacija: krajnji datum ≥ početni, budžet ≥ 0; brisanje plana briše i sve povezane entitete (cascade) |
| Upravljanje destinacijama / aktivnostima / checklist-om | Korisnik | Svaka stavka vezana za konkretan plan, vidljiva samo vlasniku |
| Evidencija troškova i pregled budžeta | Korisnik | ExpenseService poziva TripService da dobije planirani budžet i izračuna preostali |
| Generisanje/opoziv deljenog linka | Korisnik | Bira nivo pristupa (VIEW/EDIT); QR kod se generiše na SharingService-u |
| Pregled/izmena deljenog plana | Gost | Bez naloga i logovanja — pristup isključivo preko validnog share tokena; EDIT dozvoljava izmenu osnovnih podataka plana, VIEW samo pregled |
| Pregled svih korisnika | Admin | Jedino ovlašćenje koje obični Korisnik nema |
