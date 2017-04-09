import { Injectable } from '@angular/core';

/*
 * JobsService
 * 
 * Táto trieda slúži na zmenu kurzora myši. Ak práve prebieha
 * nejaká úloha (job), kurzor myši je "wait" inak je "default".
 * 
 * Na pridanie novej úlohy slúži metóda start.
 * 
 * Na dokončenie úlohy slúži metóda finish.
 * 
 */
@Injectable()
export class JobsService {

  /*
   * Pole úloh.
   */
  protected jobs: Array<String> = [];

  /*
   * Pridanie globálnej (debugovacej) funkcie na výpis úloh.
   */
  public constructor() {
    window['getJobs'] = () => {
      return this.jobs;
    }
  }

  /*
   * Waiting Cursor
   * 
   * Táto funkcia zmení kurzor myši. Ak jej pošleme "true"
   * kurzor myši za zmení na "wait" (vo windowse presýpacie hodiny).
   * Ak jej pošleme "false", kurzor sa zmení na defaultnú šípku.
   * 
   */
  protected waitingCursor(state: boolean) {
    if (state) {
      document.body.classList.add('loading');
    } else {
      document.body.classList.remove('loading');
    }
  }

  /*
   * Update Cursor
   * 
   * Ak sú nejaké "úlohy", ktoré sa zatial nedokončili, tak kurzor je "wait"
   * 
   */
  protected updateCursor(): void {
    this.waitingCursor(this.jobs.length > 0);
  }

  /*
   * Start Job
   * 
   * Vytvorí novú úlohu.
   * 
   */
  public start(jobName: String): void {
    this.jobs.push(jobName);
    this.updateCursor();
  }

  /*
   * Finish Job
   * 
   * Nastaví úlohu ako dokončenú.
   * 
   */
  public finish(jobName: String): void {
    let jobIndex = this.jobs.indexOf(jobName, 0);
    if (jobIndex >= 0) {
      this.jobs.splice(jobIndex, 1);
    }
    this.updateCursor();
  }

}
