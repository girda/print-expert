import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {AgGridService} from '../shared/services/ag-grid.sevice';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-user-page',
  templateUrl: './printers-page.component.html',
  styleUrls: ['./printers-page.component.sass']
})
export class PrintersPageComponent implements OnInit {

  formFilters: FormGroup;

  agGridIsReady = false;

  clients: any[] = [{name: 'Клієнт 1', id: 1}, {name: 'Клієнт 2', id: 2}, {name: 'Клієнт 3', id: 3}];
  cities: any[] = [{name: 'Місто 1', id: 1}, {name: 'Місто 2', id: 2}, {name: 'Місто 3', id: 3}];
  departments: any[] = [{name: 'Відділ 1', id: 1}, {name: 'Відділ 2', id: 2}, {name: 'Відділ 3', id: 3}];
  printers: any[] = [{name: 'Принтер 1', id: 1}, {name: 'Принтер 2', id: 2}, {name: 'Принтер 3', id: 3}];

  constructor(public gridService: AgGridService) {
    this.gridService.gridOptions.columnDefs = this.createColumnDefs();

    this.gridService.gridOptions.context = { componentParent: this };
  }

  ngOnInit(): void {
    this.formFilters = new FormGroup({
      client: new FormControl(null),
      city: new FormControl(null),
      department: new FormControl(null),
      printers: new FormControl()
    });
  }

  submit(event: Event): void {
    this.gridService.isReadyTable = true;
    this.gridService.init(`${environment.apiUrl}/api/operator`);
    console.log(event);
    console.log(this.formFilters.controls);
    console.log(this.formFilters.value);
  }

  createColumnDefs(): any[] {
    return [
      {
        headerName: 'Клиент',
        field: 'client',
        headerTooltip: 'Клиент'
      },
      {
        headerName: 'Город',
        field: 'city',
        headerTooltip: 'Город',
        // filter: true,
        // floatingFilter: true,
        // floatingFilterComponentParams: {suppressFilterButton: true}
      },
      {
        headerName: 'Отдел',
        field: 'department',
        headerTooltip: 'Отдел',
        filter: true,
        // floatingFilter: true,
        // floatingFilterComponentParams: {suppressFilterButton: true}
      },
      {
        headerName: 'Модель',
        field: 'model',
        headerTooltip: 'Модель'
      },
      {
        headerName: 'Серийный номер',
        field: 'serial_number',
        headerTooltip: 'Серийный номер'
      },
      {
        headerName: 'IP',
        field: 'ip',
        headerTooltip: 'IP'
      },
      {
        headerName: 'Количество распечатанных страниц',
        field: 'page_count',
        headerTooltip: 'Количество распечатанных страниц'
      },
      {
        headerName: 'Количество замен картриджей',
        headerClass: 'grid-cell-centered bg-blue',
        headerTooltip: 'Количество замен картриджей',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered bg-black',
            field: 'quantity_black',
            width: 70
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered bg-cyan',
            field: 'quantity_cn',
            width: 70
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered bg-magenta',
            field: 'quantity_mg',
            width: 70
          },
          {
            headerName: 'YI',
            headerClass: 'grid-cell-centered bg-yellow',
            field: 'quantity_yi',
            width: 70
          },
        ]
      },
      {
        headerName: 'Среднее заполнение страниц',
        headerClass: 'grid-cell-centered bg-green',
        headerTooltip: 'Среднее заполнение страниц',
        children: [
          {
            headerName: 'черный',
            headerClass: 'grid-cell-centered bg-black',
            field: 'average_coverage_bl',
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered bg-cyan',
            field: 'average_coverage_cn',
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered bg-magenta',
            field: 'average_coverage_mg',
          },
          {
            headerName: 'YI',
            headerClass: 'grid-cell-centered bg-yellow',
            field: 'average_coverage_yi',
          },
          {
            headerName: 'Всего',
            headerClass: 'grid-cell-centered',
            field: 'average_coverage_all',
          }
        ]
      },
    ];
  }

}
