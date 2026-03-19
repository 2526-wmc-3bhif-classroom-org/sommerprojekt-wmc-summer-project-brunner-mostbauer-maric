import BetterSqlite3 from "better-sqlite3";
import type { Database, Statement } from "better-sqlite3";
import { buildTables } from "./db-structure.js";

const dbFileName = "driving.db";

export class Unit {
  private readonly db: Database;
  private completed: boolean;

  public constructor(public readonly readOnly: boolean) {
    this.completed = false;
    this.db = DB.createDBConnection();
    if (!this.readOnly) {
      DB.beginTransaction(this.db);
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
  function alreadyPresent(): boolean {
    const checkStmt = unit.prepare<{ cnt: number }>(
      'select count(*) as "cnt" from DrivingSchool',
    );
    const result = checkStmt.get()?.cnt ?? 0;
    return result > 0;
  }

  function insert(): void {
    const records = [
      { Name: "Fahrschule SAFARI", Ort: "Ringstraße 48, 5280 Braunau am Inn", Inhaber: "DI (FH) Manuel Schwaiger", Email: "office@fs-safari.eu", Link: "http://www.fs-safari.at/" },
      { Name: "Fahrschule Euroline", Ort: "Ehrenreiterweg 4, 4150 Rohrbach-Berg", Inhaber: "DI Thomas Leitner, MLBT", Email: "office@fahrschule-euroline.at", Link: "https://www.fahrschule-euroline.at" },
      { Name: "ABS Fahrschule Mayr", Ort: "Am Brauteich 2, 4560 Kirchdorf", Inhaber: "Daniel Mayr", Email: "fahrschule@abs-club.at", Link: "https://absfahrschule.at" },
      { Name: "startup®-fahrschule doppler", Ort: "Hauptstraße 77, 4040 Linz-Urfahr", Inhaber: "Christian Doppler", Email: "office@startup-doppler.at", Link: "https://www.startup-doppler.at/" },
      { Name: "Fahrschule Easy Rieder", Ort: "Friedrich Thurnerstraße 7, 4910 Ried Im Innkreis", Inhaber: "Harald Rieder", Email: "office@easy-rieder.at", Link: "https://easy-rieder.at/" },
      { Name: "Fahrschule Donauland Neuhofen an der Krems", Ort: "Kirchengasse 8, 4501 Neuhofen an der Krems", Inhaber: "Ing. Mag. Werner Hackl", Email: "neuhofen@donauland.com", Link: "https://www.donauland.com/" },
      { Name: "Fahrschule Burgstaller Ried", Ort: "Friedrich-Thurner-Straße 10, 4910 Ried im Innkreis", Inhaber: "Ingrid & Johannes Burgstaller", Email: "ried@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/" },
      { Name: "Fahrschule YO-YO", Ort: "Rainerstraße 8, 4910 Ried Im Innkreis", Inhaber: "Joachim Maung", Email: "office@yo-yo.at", Link: "https://www.yo-yo.at/" },
      { Name: "Fahrschule Rastl", Ort: "Viktor Kaplan-Straße 2, 5310 Mondsee", Inhaber: "Christian Rastl", Email: "officemondsee@fahrschulerastl.at", Link: "https://www.fahrschulerastl.at/" },
      { Name: "Fahrschule Easy Drivers Steyr", Ort: "Leopold-Werndl-Straße 25/8b, 4400 Steyr", Inhaber: "Ing. Helmut Delfauro", Email: "office@easy2drive.at", Link: "https://www.easydrivers.at/steyr/" },
      { Name: "Fahrschule Moritz am Schillerpark", Ort: "Landstraße 83, 4020 Linz", Inhaber: "Daniel Moritz", Email: "fahrschule@moritz.at", Link: "https://www.moritz.at/" },
      { Name: "Fahrschule Steininger", Ort: "Waidhofnerstraße 1, 3335 Weyer", Inhaber: "Ing. Karl Steininger", Email: "weyer@fahrschule-steininger.at", Link: "https://fahrschule-steininger.at/" },
      { Name: "Fahrschule Burgstaller Schärding", Ort: "Alfred-Kubin-Straße 6, 4780 Schärding", Inhaber: "Ingrid & Johannes Burgstaller", Email: "schaerding@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/" },
      { Name: "Fahrschule fairdrive Leonding", Ort: "Ruflinger Straße 17, 4060 Leonding", Inhaber: "M. Schüttengruber", Email: "leonding@fairdrive.at", Link: "https://www.fairdrive.at/" },
      { Name: "Fahrschule Gottfried", Ort: "Dirnbergerstraße 5, 4320 Perg", Inhaber: "Ing. Gottfried Kloibhofer", Email: "office@fahrschule-gottfried.at", Link: "https://www.fahrschule-gottfried.at/" },
      { Name: "Fahrschule Donauland Freistadt", Ort: "Promenade 9, 4240 Freistadt", Inhaber: "Ing. Mag. Werner Hackl", Email: "freistadt@donauland.com", Link: "https://www.donauland.com/" },
      { Name: "Fahrschule Hammerl", Ort: "Johann-Georg-Hartwagner Straße 23/25, 4910 Ried Im Innkreis", Inhaber: "Margit Hammerl", Email: "office@fahrschule-hammerl.at", Link: "https://fahrschule-hammerl.at/" },
      { Name: "Fahrschule fairdrive Linz", Ort: "Ramsauerstraße 78, 4030 Linz", Inhaber: "M. Schüttengruber", Email: "linz@fairdrive.at", Link: "https://www.fairdrive.at/" },
      { Name: "Fahrschule Mayr", Ort: "Gaisbacherstraße 22, 4210 Gallneukirchen", Inhaber: "Karl Mayr", Email: "office@fahrschule-mayr.at", Link: "https://www.fahrschule-mayr.at/" },
      { Name: "Fahrschule Haas", Ort: "Herbert-Fladerer Straße 21, 4792 Münzkirchen", Inhaber: "Heinz Jürgen Dudek", Email: "office@fahrschule-haas.at", Link: "https://fahrschule-haas.at/" },
      { Name: "A-Team die Fahrschule", Ort: "Salzburgerstraße 48, 4650 Lambach", Inhaber: "Arben Hallac", Email: "office@ateam-fahrschule.at", Link: "https://www.ateam-fahrschule.at/" },
      { Name: "Fahrschule Kern", Ort: "Salzburgerstraße 1a, 5230 Mattighofen", Inhaber: "Franz Kern", Email: "info@fahrschule-kern.at", Link: "https://www.fahrschule-kern.at/" },
      { Name: "Fahrschule Clarissa", Ort: "Denisgasse 10, 4780 Schärding", Inhaber: "Clarissa Thann", Email: "info@fahrschule-clarissa.at", Link: "http://www.fahrschule-clarissa.at/" },
      { Name: "Fahrschule Hans Burgstaller Altheim", Ort: "Wiesnerstraße 4, 4950 Altheim Im Innkreis", Inhaber: "Hans Burgstaller", Email: "office@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/" },
      { Name: "Fahrschule Donauland Linz", Ort: "Blumauerstraße 21, 4020 Linz", Inhaber: "Ing. Mag. Werner Hackl", Email: "linz@donauland.com", Link: "https://www.donauland.com/" },
      { Name: "Fahrschule Max Trenks", Ort: "Adlerhof 22, 4600 Wels", Inhaber: "Max Trenks", Email: "info@maxtrenks.at", Link: "https://www.maxtrenks.at/" },
      { Name: "Fahrschule Lipa", Ort: "Linzerstraße 67, 4840 Vöcklabruck", Inhaber: "Ing. Stefan Krejci", Email: "fahrschule@lipa.at", Link: "https://www.lipa.at/" },
      { Name: "Fahrschule Auböck", Ort: "Linzer Straße 43, 4240 Freistadt", Inhaber: "Ing. Franz Auböck", Email: "office@ps-academy.at", Link: "https://www.ps-academy.at/" },
      { Name: "Fahrschule Donauland Pregarten", Ort: "Stadtplatz 1, 4230 Pregarten", Inhaber: "Ing. Mag. Werner Hackl", Email: "pregarten@donauland.com", Link: "https://www.donauland.com/" },
      { Name: "Fahrschule Burgstaller Andorf", Ort: "Schwanthalerstraße 2, 4770 Andorf", Inhaber: "Ingrid & Johannes Burgstaller", Email: "andorf@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/" },
      { Name: "Fahrschule Snopek", Ort: "Haidfeldstraße 33, 4060 Leonding", Inhaber: "Harald Snopek", Email: "office@fahrschule-snopek.at", Link: "http://www.fahrschule-snopek.at/" },
      { Name: "Fahrschule Mandlmayr", Ort: "Mitterweg 22, 4550 Kremsmünster", Inhaber: "Mandlmayr", Email: "fahrschule@mandlmayr.at", Link: "https://www.mandlmayr.at/" },
      { Name: "Fahrschule Easy Drivers Enns", Ort: "Linzer Straße 2, 4470 Enns", Inhaber: "", Email: "enns@easydrivers.at", Link: "https://www.easydrivers.at/enns/" },
      { Name: "Fahrschule Staudinger", Ort: "Sengsschmiedstraße 8, 4560 Kirchdorf", Inhaber: "Lars Staudinger", Email: "kirchdorf@fahrschule-staudinger.at", Link: "http://www.fahrschule-staudinger.at" },
      { Name: "Fahrschule Easy Drivers Leonding", Ort: "Haidfeldstraße 33, 4060 Leonding", Inhaber: "Harald Snopek", Email: "leonding@easydrivers.at", Link: "https://www.easydrivers.at/leonding/" },
      { Name: "Fahrschule Scharinger", Ort: "Gewerbegebiet 2, 5121 Ostermiething", Inhaber: "Ferdinand Scharinger", Email: "fahrschule-scharinger@aon.at", Link: "http://www.fahrschule-scharinger.at" },
      { Name: "startup®-fahrschule doppler", Ort: "Hauptstraße 77, 4040 Linz-Urfahr", Inhaber: "Christian Doppler", Email: "office@startup-doppler.at", Link: "https://www.startup-doppler.at/" },
      { Name: "Fahrschule Daniel Moritz", Ort: "Landstraße 83, 4020 Linz", Inhaber: "Daniel Moritz", Email: "fahrschule@moritz.at", Link: "https://www.moritz.at/" },
      { Name: "Fahrschule Gruber", Ort: "Max-Hirschenauer-Straße 8, 4780 Schärding", Inhaber: "Gerald Gruber", Email: "info@fahrschule-gruber.at", Link: "https://www.fahrschule-gruber.at/" },
      { Name: "WM-Fahrschule", Ort: "Grünbachstraße 2, 4600 Wels", Inhaber: "Dragan Nedeljkovic", Email: "office@wm-fahrschule.at", Link: "https://www.wm-fahrschule.at/" },
      { Name: "Fahrschule Charly", Ort: "Linzer Str. 16, 4100 Ottensheim", Inhaber: "Charly Thann", Email: "info@fahrschule-charly.at", Link: "https://www.fahrschule-charly.at/" },
      { Name: "Fahrschule Aschauer", Ort: "Doktor-Groß-Straße 34, 4600 Wels", Inhaber: "Reinhard Aschauer", Email: "office@fahrschule-aschauer.at", Link: "https://fahrschule-aschauer.at/" },
      { Name: "Fahrschule Staudinger", Ort: "Sengsschmiedstraße 8, 4560 Kirchdorf", Inhaber: "Lars Staudinger", Email: "kirchdorf@fahrschule-staudinger.at", Link: "http://www.fahrschule-staudinger.at" },
      { Name: "Fahrschule Lindauer", Ort: "Landstraße 76, 4020 Linz", Inhaber: "Lindauer", Email: "buero@fahrschule-lindauer.at", Link: "https://fahrschule-lindauer.at/" },
      { Name: "Fahrschule Franz Kern", Ort: "Salzburgerstraße 1a, 5230 Mattighofen", Inhaber: "Franz Kern", Email: "info@fahrschule-kern.at", Link: "https://www.fahrschule-kern.at/" },
      { Name: "Fahrschule Hausherr", Ort: "Kuferzeile 49, 4810 Gmunden", Inhaber: "Norbert Hausherr", Email: "fahrschule@hausherr.at", Link: "http://www.hausherr.at" },
      { Name: "Fahrschule Rastl", Ort: "Viktor Kaplan-Straße 2, 5310 Mondsee", Inhaber: "Christian Rastl", Email: "officemondsee@fahrschulerastl.at", Link: "https://www.fahrschulerastl.at/" },
      { Name: "Foahrschui Yurdi", Ort: "Mühlkreisbahnstraße 7, 4100 Ottensheim", Inhaber: "Yurdi Altun", Email: "office@foahrschui-yurdi.at", Link: "https://www.foahrschui-yurdi.at/" },
      { Name: "Fahrschule Noha", Ort: "Goethestraße 13, 4020 Linz", Inhaber: "Michael Schönbaß", Email: "team@fahrschule-noha.at", Link: "http://www.fahrschule-noha.at/" },
      { Name: "Fahrschule Grubhofer-Linz", Ort: "Ramsauerstraße 78, 4030 Linz", Inhaber: "Rothbauer", Email: "fahrschule-grubhofer@aon.at", Link: "https://www.fahrschule-grubhofer.at/" },
      { Name: "Fahrschule Grubhofer-Enns", Ort: "Stadlgasse 4, 4470 Enns", Inhaber: "Rothbauer", Email: "fahrschule-grubhofer@aon.at", Link: "https://www.fahrschule-grubhofer.at/" },
      { Name: "Fahrschule Hausherr", Ort: "Kuferzeile 49, 4810 Gmunden", Inhaber: "Norbert Hausherr", Email: "fahrschule@hausherr.at", Link: "http://www.hausherr.at" },
      { Name: "Fahrschule Easy Drivers Sankt Georgen an der Gusen", Ort: "Gewerbestraße 5, 4222 St. Georgen/Gusen", Inhaber: "", Email: "st-georgen@easydrivers.at", Link: "https://www.easydrivers.at/st-georgen-an-der-gusen/" },
      { Name: "Fahrschule Pichler", Ort: "Veldner Straße 57, 4120 Neufelden", Inhaber: "Pichler", Email: "neufelden@einfacherzumschein.at", Link: "https://www.einfacherzumschein.at/" },
      { Name: "Fahrschule Perfekt", Ort: "Siegfried-Marcus Strasse 5, 4070 Eferding", Inhaber: "", Email: "fahrschule.perfekt@aon.at", Link: "http://www.fahrschule-perfekt.net/" },
      { Name: "Fahrschule Lenkwerk", Ort: "Salzburger Str. 20, 4820 Bad Ischl", Inhaber: "", Email: "", Link: "https://www.fahrschule-lenkwerk.at/" },
      { Name: "Fahrschule Höglinger", Ort: "Salzburger Straße 14, 4840 Vöcklabruck", Inhaber: "Höglinger", Email: "voecklabruck@drive-hoeglinger.at", Link: "https://www.hoeglinger-voecklabruck.at/" },
      { Name: "Fahrschule Börni", Ort: "Adalbert-Stifter-Straße 20, 4053 Haid", Inhaber: "Börni", Email: "fahrschule@boerni.at", Link: "https://www.boerni.at/" },
      { Name: "Fahrschule Steininger", Ort: "Waidhofnerstraße 1, 3335 Weyer", Inhaber: "Ing. Karl Steininger", Email: "weyer@fahrschule-steininger.at", Link: "https://fahrschule-steininger.at/" },
      { Name: "Fahrschule Oliver", Ort: "Grünbachstraße 2, 4600 Wels", Inhaber: "Dragan Nedeljkovic", Email: "office@fahrschule-oliver.at", Link: "http://www.fahrschule-oliver.at/" },
      { Name: "Fahrschule Auböck", Ort: "Linzer Straße 43, 4240 Freistadt", Inhaber: "Ing. Franz Auböck", Email: "office@ps-academy.at", Link: "https://www.ps-academy.at/" },
      { Name: "Fahrschule Speed", Ort: "Schlosserstraße 2, 4240 Freistadt", Inhaber: "", Email: "office@fahrschule-speed.at", Link: "https://www.fahrschule-speed.at/" },
      { Name: "Fahrschule Stoiber", Ort: "Kirchenplatz 3, 4770 Andorf", Inhaber: "Stoiber", Email: "office@fahrschule-stoiber.at", Link: "https://www.fahrschule-stoiber.at/" },
      { Name: "Fahrschule Aschauer", Ort: "Doktor-Groß-Straße 34, 4600 Wels", Inhaber: "Reinhard Aschauer", Email: "office@fahrschule-aschauer.at", Link: "https://fahrschule-aschauer.at/" },
      { Name: "Hörtis Fahrschule Vöcklabruck", Ort: "Linzerstraße 67, 4840 Vöcklabruck", Inhaber: "Hörtner", Email: "fahrschule@hoerti.at", Link: "https://www.hoerti.at/" },
      { Name: "Fahrschule Stumpfl", Ort: "Bahnhofstraße 33, 4910 Ried im Innkreis", Inhaber: "Stumpfl", Email: "ried@fahrschule-stumpfl.at", Link: "https://www.fahrschule-stumpfl.at/" },
      { Name: "Fahrschule Easy Drivers Linz-Ebelsberg", Ort: "Hofmannsthalweg 1, 4030 Linz", Inhaber: "", Email: "ebelsberg@easydrivers.at", Link: "https://www.easydrivers.at/linz-ebelsberg/" },
      { Name: "Fahrschule Burgstaller", Ort: "Alfred-Kubin-Straße 6, 4780 Schärding", Inhaber: "Ingrid & Johannes Burgstaller", Email: "schaerding@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/" },
      { Name: "Fahrschule My Friends", Ort: "Hostauerstraße 87, 4100 Ottensheim", Inhaber: "", Email: "info@fahrschule-myfriends.at", Link: "https://www.fahrschule-myfriends.at/" },
      { Name: "Fahrschule Easy Drivers Perg", Ort: "Linzer Straße 11, 4320 Perg", Inhaber: "", Email: "perg@easydrivers.at", Link: "https://www.easydrivers.at/perg/" },
      { Name: "Fahrschule DI Adolf Nefischer", Ort: "Dirnbergerstraße 42, 4320 Perg", Inhaber: "Adolf Nefischer", Email: "a.nefischer@aon.at", Link: "http://fahrschule-nefischer.at/" },
      { Name: "Fahrschule Alkoven", Ort: "Hochfeldstraße 1, 4072 Alkoven", Inhaber: "Florian Köberl", Email: "info@fahrschule-alkoven.at", Link: "https://www.fahrschule-alkoven.at/" },
      { Name: "Fahrschule Pichler", Ort: "Veldner Straße 57, 4120 Neufelden", Inhaber: "Pichler", Email: "neufelden@einfacherzumschein.at", Link: "https://www.einfacherzumschein.at/" },
      { Name: "Fahrschule Burgstaller", Ort: "Schwanthalerstraße 2, 4770 Andorf", Inhaber: "Ingrid & Johannes Burgstaller", Email: "andorf@fahrschule-burgstaller.at", Link: "https://www.fahrschule-burgstaller.at/" },
      { Name: "Fahrschule KURT", Ort: "Sparkassenplatz 2, 4210 Gallneukirchen", Inhaber: "Kurt Pichler", Email: "office@fahrschule-pichler.at", Link: "https://www.einfacherzumschein.at/" },
      { Name: "Fahrschule Aschauer", Ort: "Doktor-Groß-Straße 34, 4600 Wels", Inhaber: "Reinhard Aschauer", Email: "office@fahrschule-aschauer.at", Link: "https://fahrschule-aschauer.at/" },
      { Name: "Fahrschule DI Adolf Nefischer", Ort: "Dirnbergerstraße 42, 4320 Perg", Inhaber: "Adolf Nefischer", Email: "a.nefischer@aon.at", Link: "http://fahrschule-nefischer.at/" },
    ];

    const insertStmt = unit.prepare(
      `INSERT INTO DrivingSchool (Name, Location, Owner, Email, Website)
       VALUES (?, ?, ?, ?, ?)`,
    );

    for (const record of records) {
      insertStmt.run(
        record.Name,
        record.Ort,
        record.Inhaber,
        record.Email,
        record.Link
      );
    }
  }

  if (!alreadyPresent()) {
    insert();
    return "inserted";
  }

  return "skipped";
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
