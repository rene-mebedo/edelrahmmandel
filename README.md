# Gutachten Plus

Ein Tool zum Erstellen eines Gutachten.

## Version 1

Das ist die Version, die wir als Pilot zu anfg. Januar in Betrieb nehmen.
geplanter `Going-Live: KW 3`

## Offene Punkte

### Development MT
- [ ] Prüfung anderer PDF-Reader-Tools
- [ ] PDF Erstellung / Ablage des generierten PDFs
- [ ] HTML/PDF-Formatierung / Rendering gem. Gutachtenvorlagen JK
- [x] Result des package sollte der generierte HTML-Code sein
- [ ] Detail `Titel im Druck` immer im Ausdruck verwandt (auch Inhaltsverz.) Ist das Feld leer, so wird kein Titel gedruckt.
- [x] npm Publish PDF-Erstellung
- [ ] Zeige Detailpunkt im Inhaltsverzeichnis J/N
- [ ] Auflistung aller verwandten Variablen z.B. "{{Kunde}}"
- [ ] Dynamischer Replace von Opinion-Variablen
- [ ] Interne Variablen ausprogrammieren z.B. `${Druckdatum}`


**Erledigte Punkte:**
- [x] Generierung der Signaturen inkl. richtigem Stempel
> Die Signaturen werden nicht generiert sondern über einen eigenen Detailpunkt am Ende des Gutachtens abgebildet und jeder Gutachter muss seinen Stempel und Unterschrift ind. als Bild einfügen.


### Development RStH
- [x] Generiere opinionNo beim Neuzugang
- [ ] Neues Feld im `OpinionDetail` > `showInToc` in Oberfläche integrieren
- [x] Opinion und OpininoDetail-Felder abgleichen und implementieren mit Edelrahm RS-MT
- [ ] Einbindung PDF-Erstellung in Edelrahm
- [ ] Teilen des Gutachtens mit anderen Benutzers
- [x] Stammdatenverwaltung (Bearbeitung von Teilnehmern, Gutachter 1, 2 usw.)
- [x] Neuanlage Gutachten
  - [ ] Erstellen einer Vorlage
  - [x] Erstellen eines Gutachtens auf Basis eines anderen Gutachtens X
- [ ] Bearbeitung eines Detailpunkts
  - [ ] Pflege des Maßnahmentextes zu einem Detail vom Typ "Frage"
  - [ ] Pflege des "Maßnahmen-Default" für den Typ "Antwort"
- [ ] Bilder
  - [ ] Ablageort prüfen
  - [ ] Komprimierung
- [ ] Menu vollständig einklappbar
- [ ] Aktivitätsleiste vollständig einklappbar
- [ ] Übernahme der Maßnahmen inkl. Maßnahmentexte in Punkt 8 - Abschlussbetrachtung
- [ ] Verwaltung von Variablen, die dynamisch im Gutachten ersetzt werden
- [ ] Zeige Detailpunkt im Inhaltsverzeichnis J/N
- [ ] Beim erstellen eines Gutachten auf Basis einer Vorlage, müssen die Variablen übernommen werden, jedoch die aktuellen Werte gelöscht sein.


### IT Operations
- [ ] Hosting
- [ ] Backup

### Going-Live Vorbereitungen
- [ ] Update `printTitle` mit Wert aus `Title` über alle `OpinionDetails`
- [ ] Replace der Variablen `@Kunde@` und `@ProjektleiterKunde@` mit den neuen Variablen `{{xxx}}`
- [ ] Hinzufügen der neuen Variablen in der Gutachtenvorlage


### Consulting Jürgen K./Marc Schlüter (über HP)

- [ ] Überarbeitung und textuelle Fertigstellung der Gutachtenvorlage
- [ ] Ggf. weitere Vorlagen erstellen z.B. "Kurzgutachten" / "Assessment"


## Version 1.1

Alle Punkte, die noch erledigt werden müssen um die Version 1 "rund zu machen"

- [ ] Benutzerverwaltung Administration
  - [ ] Neuanlage von Benutzers
  - [ ] Rollenzuweisung/Administration für bestehende Benutzer
  - [ ] Sperren einzelner Benutzer

- [ ] Einladen von "fremden" in das System, wenn diese noch nicht als Benutzer geführt sind
- [ ] Workflow  

- [ ]

## Version 1.2

Weitere Punkte, die ggf. das Leben erleichtern

- [ ] Gutachtenerstellung auf basis bereits erstellter Gutachten
  - [ ] Detaillierte Besprechung mit JK
  - [ ] Kopierfunktion bestehendes Gutachten mit "Rücksetzung" der gegebenen Antworten
  - [ ] Einfügefunktion um bereits formulierte Texte (Fragen, Antworten) aus bereits erstellten Gutachten zu übernehmen
- [ ] Sortierung der Detailpunkte via Drag & Drop
- [ ] Suchfunktion für Inhalte und Titel/Detailpunkte


## geplante Punkte für Version 2

Weitere geplante Punkte ohne Priorisierung
- [ ] Authentifizierung Auth0
- [ ] Aufgabenmanagement
- [ ] Erstellen von Aufgaben ausgehend vom Gutachten (Abschlussbetrachtung)
- [ ] Benutzer könnem indv. Aufgaben erstellen
- [ ] Führen der OPL als Aufgaben
- [ ] Gemeinsames Arbeiten mit dem Kunden
  
## Version 3

Kundenportal für Consulting und Ablage aller erstellter Dokumente
aus Teams/M-Files, so dass dieses Portal der zentrale Ort für den Kunden und unsere Kollegen wird.


## Punkte zum besprechen

- [ ] Nennung der Uhrzeiten Tageweise sinnvoll? Ggf. alternative hierfür
- [ ] Auflistung der TN mit oder ohne Anrede? Aktuell ohne Anrede, da ggf. Anrede falsch eingegeben wird der Fehler nicht gezeigt
- [ ] Darstellung des Abkürzungsverzeichnis als eigene Detailpunkte und manuelle Pflege im Gutachten möglich?