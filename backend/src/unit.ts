import BetterSqlite3 from "better-sqlite3";
import type { Database, Statement } from "better-sqlite3";
import { buildTables } from "./db-structure.js";
import bcrypt from "bcrypt";
import { UserRole } from "./models/types.js";

const dbFileName = "driving.db";

export class Unit {
  private readonly db: Database;
  private completed: boolean;

  public constructor(public readonly readOnly: boolean) {
    this.completed = false;
    this.db = DB.createDBConnection();
    if (!this.readOnly) {
      try {
        DB.beginTransaction(this.db);
      } catch (e) {
        // transaction already active or other error
      }
    }
  }

  public static createReadonly(): Unit {
    return new Unit(true);
  }

  public prepare<
    TResult,
    TParams extends Record<string, unknown> = Record<string, unknown>,
  >(sql: string, bindings?: TParams): ITypedStatement<TResult, TParams> {
    const stmt = this.db.prepare<unknown[], TResult>(sql);
    if (bindings != null) {
      stmt.bind(bindings as unknown);
    }
    return stmt as unknown as ITypedStatement<TResult, TParams>;
  }

  public getLastRowId(): number {
    const stmt = this.prepare<{ id: number }>(
      'SELECT last_insert_rowid() as "id"',
    );
    const result = stmt.get();
    if (!result) {
      throw new Error("Unable to retrieve last inserted row id");
    }
    return result.id;
  }

  public complete(commit: boolean | null = null): void {
    if (this.completed) {
      return;
    }
    this.completed = true;

    if (commit !== null) {
      commit ? DB.commitTransaction(this.db) : DB.rollbackTransaction(this.db);
    } else if (!this.readOnly) {
      throw new Error(
        "transaction has been opened, requires information if commit or rollback needed",
      );
    }
    this.db.close();
  }
}

export function ensureSampleDataInserted(unit: Unit): "inserted" | "skipped" {
  function adminAlreadyPresent(): boolean {
    try {
      const checkStmt = unit.prepare<{ cnt: number }>(
        "select count(*) as 'cnt' from User where Email = 'admin@admin.com'",
      );
      const result = checkStmt.get()?.cnt ?? 0;
      return result > 0;
    } catch (e: any) {
      return false;
    }
  }

  function schoolsAlreadyPresent(): boolean {
    try {
      const checkStmt = unit.prepare<{ cnt: number }>(
        "select count(*) as 'cnt' from DrivingSchool",
      );
      const result = checkStmt.get()?.cnt ?? 0;
      return result > 0;
    } catch (e: any) {
      return false;
    }
  }

  function insertAdmin(): void {
    const adminPasswordHash = bcrypt.hashSync("admin", 10);
    const adminUser = {
      UserName: "admin",
      Email: "admin@admin.com",
      PasswordHash: adminPasswordHash,
      Role: UserRole.ADMIN,
    };

    const userInsertStmt = unit.prepare(
      `INSERT OR IGNORE INTO User (UserName, Email, PasswordHash, Role)
       VALUES (?, ?, ?, ?)`
    );

    userInsertStmt.run(
      adminUser.UserName,
      adminUser.Email,
      adminUser.PasswordHash,
      adminUser.Role
    );
  }

  function insertSchools(): void {
    const records = [
      { Name: "Fahrschule SAFARI", Ort: "Ringstraße 48, 5280 Braunau am Inn", Inhaber: "DI (FH) Manuel Schwaiger", Email: "office@fs-safari.eu", Link: "http://www.fs-safari.at/", Phone: "+43 7742 318330" },
      { Name: "Fahrschule Euroline", Ort: "Ehrenreiterweg 4, 4150 Rohrbach-Berg", Inhaber: "DI Thomas Leitner, MLBT", Email: "office@fahrschule-euroline.at", Link: "https://www.fahrschule-euroline.at", Phone: "+43 7289 4090" },
      { Name: "ABS Fahrschule Mayr", Ort: "Am Brauteich 2, 4560 Kirchdorf", Inhaber: "Daniel Mayr", Email: "fahrschule@abs-club.at", Link: "https://absfahrschule.at", Phone: "+43 7582 60222" },
      { Name: "startup®-fahrschule doppler", Ort: "Hauptstraße 77, 4040 Linz-Urfahr", Inhaber: "Christian Doppler", Email: "office@startup-doppler.at", Link: "https://www.startup-doppler.at/", Phone: "0664 60737 7000" },
      { Name: "Fahrschule Easy Rieder", Ort: "Friedrich Thurnerstraße 7, 4910 Ried Im Innkreis", Inhaber: "Harald Rieder", Email: "office@easy-rieder.at", Link: "https://easy-rieder.at/", Phone: "+43 7752 71300" },
      { Name: "Fahrschule Donauland Neuhofen an der Krems", Ort: "Kirchengasse 8, 4501 Neuhofen an der Krems", Inhaber: "Ing. Mag. Werner Hackl", Email: "neuhofen@donauland.com", Link: "https://www.donauland.com/", Phone: "0676 / 72 45 675" },
      { Name: "Fahrschule Burgstaller Ried", Ort: "Friedrich-Thurner-Straße 10, 4910 Ried im Innkreis", Inhaber: "Ingrid & Johannes Burgstaller", Email: "ried@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/", Phone: "+43 7752 89070" },
      { Name: "Fahrschule YO-YO", Ort: "Rainerstraße 8, 4910 Ried Im Innkreis", Inhaber: "Joachim Maung", Email: "office@yo-yo.at", Link: "https://www.yo-yo.at/", Phone: "07752 -88813" },
      { Name: "Fahrschule Rastl", Ort: "Viktor Kaplan-Straße 2, 5310 Mondsee", Inhaber: "Christian Rastl", Email: "officemondsee@fahrschulerastl.at", Link: "https://www.fahrschulerastl.at/", Phone: "N/A" },
      { Name: "Fahrschule Easy Drivers Steyr", Ort: "Leopold-Werndl-Straße 25/8b, 4400 Steyr", Inhaber: "Ing. Helmut Delfauro", Email: "office@easy2drive.at", Link: "https://www.easydrivers.at/steyr/", Phone: "07252 / 51 700" },
      { Name: "Fahrschule Moritz am Schillerpark", Ort: "Landstraße 83, 4020 Linz", Inhaber: "Daniel Moritz", Email: "fahrschule@moritz.at", Link: "https://www.moritz.at/", Phone: "0732 / 30 51 71" },
      { Name: "Fahrschule Steininger", Ort: "Waidhofnerstraße 1, 3335 Weyer", Inhaber: "Ing. Karl Steininger", Email: "weyer@fahrschule-steininger.at", Link: "https://fahrschule-steininger.at/", Phone: "+43725253561" },
      { Name: "Fahrschule Burgstaller Schärding", Ort: "Alfred-Kubin-Straße 6, 4780 Schärding", Inhaber: "Ingrid & Johannes Burgstaller", Email: "schaerding@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/", Phone: "07712 / 28 01" },
      { Name: "Fahrschule fairdrive Leonding", Ort: "Ruflinger Straße 17, 4060 Leonding", Inhaber: "M. Schüttengruber", Email: "leonding@fairdrive.at", Link: "https://www.fairdrive.at/", Phone: "+43 732 / 38 53 55 2" },
      { Name: "Fahrschule Gottfried", Ort: "Dirnbergerstraße 5, 4320 Perg", Inhaber: "Ing. Gottfried Kloibhofer", Email: "office@fahrschule-gottfried.at", Link: "https://www.fahrschule-gottfried.at/", Phone: "07262 57 003" },
      { Name: "Fahrschule Donauland Freistadt", Ort: "Promenade 9, 4240 Freistadt", Inhaber: "Ing. Mag. Werner Hackl", Email: "freistadt@donauland.com", Link: "https://www.donauland.com/", Phone: "07942 / 73 4 73" },
      { Name: "Fahrschule Hammerl", Ort: "Johann-Georg-Hartwagner Straße 23/25, 4910 Ried Im Innkreis", Inhaber: "Margit Hammerl", Email: "office@fahrschule-hammerl.at", Link: "https://fahrschule-hammerl.at/", Phone: "07752-82717" },
      { Name: "Fahrschule fairdrive Linz", Ort: "Ramsauerstraße 78, 4030 Linz", Inhaber: "M. Schüttengruber", Email: "linz@fairdrive.at", Link: "https://www.fairdrive.at/", Phone: "+43 732 / 38 53 55 1" },
      { Name: "Fahrschule Mayr", Ort: "Gaisbacherstraße 22, 4210 Gallneukirchen", Inhaber: "Karl Mayr", Email: "office@fahrschule-mayr.at", Link: "https://www.fahrschule-mayr.at/", Phone: "07235 / 66 600" },
      { Name: "Fahrschule Haas", Ort: "Herbert-Fladerer Straße 21, 4792 Münzkirchen", Inhaber: "Heinz Jürgen Dudek", Email: "office@fahrschule-haas.at", Link: "https://fahrschule-haas.at/", Phone: "+43 7716 7110" },
      { Name: "A-Team die Fahrschule", Ort: "Salzburgerstraße 48, 4650 Lambach", Inhaber: "Arben Hallac", Email: "office@ateam-fahrschule.at", Link: "https://www.ateam-fahrschule.at/", Phone: "+43 7245 22377" },
      { Name: "Fahrschule Kern", Ort: "Salzburgerstraße 1a, 5230 Mattighofen", Inhaber: "Franz Kern", Email: "info@fahrschule-kern.at", Link: "https://www.fahrschule-kern.at/", Phone: "07722 / 63 272" },
      { Name: "Fahrschule Clarissa", Ort: "Denisgasse 10, 4780 Schärding", Inhaber: "Clarissa Thann", Email: "info@fahrschule-clarissa.at", Link: "https://www.schaerding.ooe.gv.at/Fahrschule_Clarissa", Phone: "0664/131 00 34" },
      { Name: "Fahrschule Hans Burgstaller Altheim", Ort: "Wiesnerstraße 4, 4950 Altheim Im Innkreis", Inhaber: "Hans Burgstaller", Email: "office@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/", Phone: "07723 / 4 24 84" },
      { Name: "Fahrschule Donauland Linz", Ort: "Blumauerstraße 21, 4020 Linz", Inhaber: "Ing. Mag. Werner Hackl", Email: "linz@donauland.com", Link: "https://www.donauland.com/", Phone: "0732 / 656 256" },
      { Name: "Fahrschule Max Trenks", Ort: "Adlerhof 22, 4600 Wels", Inhaber: "Max Trenks", Email: "info@maxtrenks.at", Link: "https://www.maxtrenks.at/", Phone: "+43 7242 446230" },
      { Name: "Fahrschule Lipa", Ort: "Linzerstraße 67, 4840 Vöcklabruck", Inhaber: "Ing. Stefan Krejci", Email: "fahrschule@lipa.at", Link: "https://www.lipa.at/", Phone: "07672 / 722 07" },
      { Name: "Fahrschule Auböck", Ort: "Linzer Straße 43, 4240 Freistadt", Inhaber: "Ing. Franz Auböck", Email: "office@ps-academy.at", Link: "https://www.ps-academy.at/", Phone: "+43 7942 72 4 71" },
      { Name: "Fahrschule Donauland Pregarten", Ort: "Stadtplatz 1, 4230 Pregarten", Inhaber: "Ing. Mag. Werner Hackl", Email: "pregarten@donauland.com", Link: "https://www.donauland.com/", Phone: "0676/ 50 31 553" },
      { Name: "Fahrschule Burgstaller Andorf", Ort: "Schwanthalerstraße 2, 4770 Andorf", Inhaber: "Ingrid & Johannes Burgstaller", Email: "andorf@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/", Phone: "07712 / 28 01" },
      { Name: "Fahrschule Snopek", Ort: "Haidfeldstraße 33, 4060 Leonding", Inhaber: "Harald Snopek", Email: "office@fahrschule-snopek.at", Link: "http://www.fahrschule-snopek.at/", Phone: "0650/9402281" },
      { Name: "Fahrschule Mandlmayr", Ort: "Mitterweg 22, 4550 Kremsmünster", Inhaber: "Mandlmayr", Email: "fahrschule@mandlmayr.at", Link: "https://www.mandlmayr.at/", Phone: "07583 / 8562" },
      { Name: "Fahrschule Easy Drivers Enns", Ort: "Linzer Straße 2, 4470 Enns", Inhaber: "", Email: "enns@easydrivers.at", Link: "https://www.easydrivers.at/enns/", Phone: "+43 7 2238 0090" },
      { Name: "Fahrschule Staudinger", Ort: "Sengsschmiedstraße 8, 4560 Kirchdorf", Inhaber: "Lars Staudinger", Email: "kirchdorf@fahrschule-staudinger.at", Link: "http://www.fahrschule-staudinger.at", Phone: "+43 7582 63183" },
      { Name: "Fahrschule Easy Drivers Leonding", Ort: "Haidfeldstraße 33, 4060 Leonding", Inhaber: "Harald Snopek", Email: "leonding@easydrivers.at", Link: "https://www.easydrivers.at/leonding/", Phone: "+43 7 32 99 77 99" },
      { Name: "Fahrschule Scharinger", Ort: "Gewerbegebiet 2, 5121 Ostermiething", Inhaber: "Ferdinand Scharinger", Email: "fahrschule-scharinger@aon.at", Link: "http://www.fahrschule-scharinger.at", Phone: "06278/7575" },
      { Name: "startup®-fahrschule doppler", Ort: "Hauptstraße 77, 4040 Linz-Urfahr", Inhaber: "Christian Doppler", Email: "office@startup-doppler.at", Link: "https://www.startup-doppler.at/", Phone: "0664 60737 7000" },
      { Name: "Fahrschule Daniel Moritz", Ort: "Landstraße 83, 4020 Linz", Inhaber: "Daniel Moritz", Email: "fahrschule@moritz.at", Link: "https://www.moritz.at/", Phone: "0732/30 51 71" },
      { Name: "Fahrschule Gruber", Ort: "Max-Hirschenauer-Straße 8, 4780 Schärding", Inhaber: "Gerald Gruber", Email: "info@fahrschule-gruber.at", Link: "https://www.fahrschule-gruber.at/", Phone: "N/A" },
      { Name: "WM-Fahrschule", Ort: "Grünbachstraße 2, 4600 Wels", Inhaber: "Dragan Nedeljkovic", Email: "office@wm-fahrschule.at", Link: "https://www.wm-fahrschule.at/", Phone: " 07582/ 60666" },
      { Name: "Fahrschule Charly", Ort: "Linzer Str. 16, 4100 Ottensheim", Inhaber: "Charly Thann", Email: "info@fahrschule-charly.at", Link: "https://www.fahrschulecharly.at/", Phone: "03462/30 220" },
      { Name: "Fahrschule Aschauer", Ort: "Doktor-Groß-Straße 34, 4600 Wels", Inhaber: "Reinhard Aschauer", Email: "office@fahrschule-aschauer.at", Link: "https://fahrschule-aschauer.at/", Phone: "0043 7242 42 222" },
      { Name: "Fahrschule Staudinger", Ort: "Sengsschmiedstraße 8, 4560 Kirchdorf", Inhaber: "Lars Staudinger", Email: "kirchdorf@fahrschule-staudinger.at", Link: "http://www.fahrschule-staudinger.at", Phone: "0681/81652924" },
      { Name: "Fahrschule Lindauer", Ort: "Landstraße 76, 4020 Linz", Inhaber: "Lindauer", Email: "buero@fahrschule-lindauer.at", Link: "https://fahrschule-lindauer.at/", Phone: "0732 609 609" },
      { Name: "Fahrschule Franz Kern", Ort: "Salzburgerstraße 1a, 5230 Mattighofen", Inhaber: "Franz Kern", Email: "info@fahrschule-kern.at", Link: "https://www.fahrschule-kern.at/", Phone: "07742 / 28 16" },
      { Name: "Fahrschule Hausherr", Ort: "Kuferzeile 49, 4810 Gmunden", Inhaber: "Norbert Hausherr", Email: "fahrschule@hausherr.at", Link: "http://www.hausherr.at", Phone: "07612 646 87" },
      { Name: "Fahrschule Rastl", Ort: "Viktor Kaplan-Straße 2, 5310 Mondsee", Inhaber: "Christian Rastl", Email: "officemondsee@fahrschulerastl.at", Link: "https://www.fahrschulerastl.at/", Phone: "06232/2535" },
      { Name: "Fahrschule Noha", Ort: "Goethestraße 13, 4020 Linz", Inhaber: "Michael Schönbaß", Email: "team@fahrschule-noha.at", Link: "http://www.fahrschule-noha.at/", Phone: "0732/770283" },
      { Name: "Fahrschule Grubhofer-Linz", Ort: "Ramsauerstraße 78, 4030 Linz", Inhaber: "Rothbauer", Email: "fahrschule-grubhofer@aon.at", Link: "https://www.fahrschule-grubhofer.at/", Phone: "07223/82435 od. 0699/16 46 80 82" },
      { Name: "Fahrschule Grubhofer-Enns", Ort: "Stadlgasse 4, 4470 Enns", Inhaber: "Rothbauer", Email: "fahrschule-grubhofer@aon.at", Link: "https://www.fahrschule-grubhofer.at/", Phone: "07223/82435 od. 0699/16 46 80 82" },
      { Name: "Fahrschule Hausherr", Ort: "Kuferzeile 49, 4810 Gmunden", Inhaber: "Norbert Hausherr", Email: "fahrschule@hausherr.at", Link: "http://www.hausherr.at", Phone: "06132 23405" },
      { Name: "Fahrschule Pichler", Ort: "Veldner Straße 57, 4120 Neufelden", Inhaber: "Pichler", Email: "neufelden@einfacherzumschein.at", Link: "https://www.einfacherzumschein.at/", Phone: "N/A" },
      { Name: "Fahrschule Perfekt", Ort: "Siegfried-Marcus Strasse 5, 4070 Eferding", Inhaber: "", Email: "fahrschule.perfekt@aon.at", Link: "http://www.fahrschule-perfekt.net/", Phone: "07272/32 35" },
      { Name: "Fahrschule Lenkwerk", Ort: "Salzburger Str. 20, 4820 Bad Ischl", Inhaber: "", Email: "", Link: "http://www.lenkwerk.at", Phone: "+43 7242 277950" },
      { Name: "Fahrschule Höglinger", Ort: "Salzburger Straße 14, 4840 Vöcklabruck", Inhaber: "Höglinger", Email: "voecklabruck@drive-hoeglinger.at", Link: "https://www.hoeglinger-voecklabruck.at/", Phone: "07672 75 390" },
      { Name: "Fahrschule Börni", Ort: "Adalbert-Stifter-Straße 20, 4053 Haid", Inhaber: "Börni", Email: "fahrschule@boerni.at", Link: "https://www.boerni.at/", Phone: "+43 676 4115244" },
      { Name: "Fahrschule Steininger", Ort: "Waidhofnerstraße 1, 3335 Weyer", Inhaber: "Ing. Karl Steininger", Email: "weyer@fahrschule-steininger.at", Link: "https://fahrschule-steininger.at/", Phone: "+43 7252 535 61" },
      { Name: "Fahrschule Oliver", Ort: "Grünbachstraße 2, 4600 Wels", Inhaber: "Dragan Nedeljkovic", Email: "office@fahrschule-oliver.at", Link: "http://www.fahrschule-oliver.at/", Phone: "+437242219966" },
      { Name: "Fahrschule Auböck", Ort: "Linzer Straße 43, 4240 Freistadt", Inhaber: "Ing. Franz Auböck", Email: "office@ps-academy.at", Link: "https://www.ps-academy.at/", Phone: "+43 7942 72 4 71" },
      { Name: "Fahrschule Aschauer", Ort: "Doktor-Groß-Straße 34, 4600 Wels", Inhaber: "Reinhard Aschauer", Email: "office@fahrschule-aschauer.at", Link: "https://fahrschule-aschauer.at/", Phone: "0043 7242 42 222" },
      { Name: "Fahrschule Easy Drivers Linz-Ebelsberg", Ort: "Hofmannsthalweg 1, 4030 Linz", Inhaber: "", Email: "ebelsberg@easydrivers.at", Link: "https://www.easydrivers.at/linz", Phone: "+43 732 890 545" },
      { Name: "Fahrschule Burgstaller", Ort: "Alfred-Kubin-Straße 6, 4780 Schärding", Inhaber: "Ingrid & Johannes Burgstaller", Email: "schaerding@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/", Phone: "07712 / 28 01" },
      { Name: "Fahrschule My Friends", Ort: "Hostauerstraße 87, 4100 Ottensheim", Inhaber: "", Email: "info@fahrschule-myfriends.at", Link: "https://www.fahrschule-myfriends.at/", Phone: "+43 7234 86064" },
      { Name: "Fahrschule Easy Drivers Perg", Ort: "Linzer Straße 11, 4320 Perg", Inhaber: "", Email: "perg@easydrivers.at", Link: "https://www.easydrivers.at/perg/", Phone: "+43 7 2625 3123" },
      { Name: "Fahrschule DI Adolf Nefischer", Ort: "Dirnbergerstraße 42, 4320 Perg", Inhaber: "Adolf Nefischer", Email: "a.nefischer@aon.at", Link: "http://fahrschule-nefischer.at/", Phone: "07262 / 52453-0" },
      { Name: "Fahrschule Alkoven", Ort: "Hochfeldstraße 1, 4072 Alkoven", Inhaber: "Florian Köberl", Email: "info@fahrschule-alkoven.at", Link: "https://www.fahrschule-alkoven.at/", Phone: "+43 7274 647 47" },
      { Name: "Fahrschule Burgstaller", Ort: "Schwanthalerstraße 2, 4770 Andorf", Inhaber: "Ingrid & Johannes Burgstaller", Email: "andorf@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/", Phone: "07712 / 28 01" },
      { Name: "Fahrschule KURT", Ort: "Sparkassenplatz 2, 4210 Gallneukirchen", Inhaber: "Kurt Pichler", Email: "office@fahrschule-pichler.at", Link: "https://www.einfacherzumschein.at/", Phone: "N/A" },
      { Name: "Fahrschule Aschauer", Ort: "Doktor-Groß-Straße 34, 4600 Wels", Inhaber: "Reinhard Aschauer", Email: "office@fahrschule-aschauer.at", Link: "https://fahrschule-aschauer.at/", Phone: "07242 42 222" },
      { Name: "Fahrschule DI Adolf Nefischer", Ort: "Dirnbergerstraße 42, 4320 Perg", Inhaber: "Adolf Nefischer", Email: "a.nefischer@aon.at", Link: "http://fahrschule-nefischer.at/", Phone: "07262 / 52453-0" },
    ];

    const insertStmt = unit.prepare(
      `INSERT INTO DrivingSchool (Name, Location, Owner, Email, Website, Phone)
       VALUES (?, ?, ?, ?, ?)`,
    );

    for (const record of records) {
      insertStmt.run(
        record.Name,
        record.Ort,
        record.Inhaber,
        record.Email,
        record.Link,
        record.Phone
      );
    }
  }

  let inserted = false;
  if (!adminAlreadyPresent()) {
    insertAdmin();
    inserted = true;
  }

  if (!schoolsAlreadyPresent()) {
    insertSchools();
    inserted = true;
  }

  return inserted ? "inserted" : "skipped";
}

class DB {
  public static createDBConnection(): Database {
    const db = new BetterSqlite3(dbFileName, {
      fileMustExist: false,
      verbose: (s: unknown) => DB.logStatement(s),
    });
    db.pragma("foreign_keys = ON");

    DB.ensureTablesCreated(db);

    return db;
  }

  public static beginTransaction(connection: Database): void {
    connection.exec("begin transaction;");
  }

  public static commitTransaction(connection: Database): void {
    connection.exec("commit;");
  }

  public static rollbackTransaction(connection: Database): void {
    connection.exec("rollback;");
  }

  private static logStatement(statement: string | unknown): void {
    if (typeof statement !== "string") {
      return;
    }
    const start = statement.slice(0, 6).trim().toLowerCase();
    if (start.startsWith("pragma") || start.startsWith("create")) {
      return;
    }
    console.log(`SQL: ${statement}`);
  }

  private static ensureTablesCreated(connection: Database): void {
    connection.exec(`PRAGMA foreign_keys = ON;`);
    buildTables(connection);
  }
}

type RawStatement<TResult> = BetterSqlite3.Statement<unknown[], TResult>;
type RunResult = ReturnType<RawStatement<unknown>["run"]>;

export interface ITypedStatement<TResult = unknown, TParams = unknown> {
  // phantom type, just carries the params type for tooling
  readonly _params?: TParams;

  get(...params: unknown[]): TResult | undefined;

  all(...params: unknown[]): TResult[];

  run(...params: unknown[]): RunResult;
}
