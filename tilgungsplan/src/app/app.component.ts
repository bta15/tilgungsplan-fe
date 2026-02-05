import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TilgungsplanService} from "./service/tilgungsplan.service";
import {MatCard} from "@angular/material/card";
import {TilgungsplanEntry, TilgungsplanResponse} from "./entity/tilgungsplan-response";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import { CurrencyPipe, DatePipe } from "@angular/common";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {TilgungsplanRequest} from "./entity/tilgungsplan-request";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";
import {default as _rollupMoment, Moment} from "moment";
import {CurrencyMaskModule} from "ng2-currency-mask";
import 'moment/locale/de';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; //workaround für ein moment-Bug, da sonst im Datepicker alles auf Englisch ist


const moment = _rollupMoment || _moment;

@Component({
    selector: 'app-root',
    imports: [
    RouterOutlet,
    MatCard,
    MatHint,
    MatFormField,
    MatLabel,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMiniFabButton,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    CurrencyMaskModule,
    DatePipe
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  darlehensbetrag: number = 100000.0;
  sollzinsProzent: number = 2.12;
  startTilgungProzent: number = 2;
  zinsbindungJahre: number = 10;
  readonly startdatum = new FormControl(moment())

  tilgungsplanResponse: TilgungsplanResponse = {} as TilgungsplanResponse;

  displayedColumns: string[] = ['datum', 'restschuldEuro', 'zinsenEuro', 'tilgungAuszahlungEuro', 'rateEuro'];
  dataSource = new MatTableDataSource<TilgungsplanEntry>(this.tilgungsplanResponse.tilgungsplanMonate);

  constructor(private tilgungsplanService: TilgungsplanService,) {
  }

  setMonthAndYear(monthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startdatum.value ?? moment();
    ctrlValue.month(monthAndYear.month())
    ctrlValue.year(monthAndYear.year())
    this.startdatum.setValue(ctrlValue)
    datepicker.close()
  }

  onClickPlanErstellen(): void {
    const year: number = this.startdatum.value ? this.startdatum.value?.year() : new Date().getFullYear();
    const month = this.startdatum.value ? this.startdatum.value?.month() : new Date().getMonth();
    const request: TilgungsplanRequest = {
      darlehensbetragEuro: this.darlehensbetrag,
      sollzinsProzent: this.sollzinsProzent,
      anfaenglicheTilgungProzent: this.startTilgungProzent,
      zinsbindungJahre: this.zinsbindungJahre,
      startdatum: new Date(year, month, 1, 10, 0, 0, 0)
    };
    this.tilgungsplanService.getTilgungsplan(request).subscribe(response => {
      this.tilgungsplanResponse = response;
      this.dataSource = new MatTableDataSource<TilgungsplanEntry>(this.tilgungsplanResponse.tilgungsplanMonate);
    })
  }

  onClickPrintTable(): void {
    const doc = new jsPDF();
    autoTable(doc, {html: '#tabelle'})

    doc.save('tilgungsplan.pdf')
  }


}
