import {Component, OnInit, ViewChild} from '@angular/core';
import { SensorPosition } from 'src/app/Sensor';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Sensorendata} from "../../Sensorendata";

@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
  styleUrls: ['./sensors-data.component.scss']
})
export class SensorsDataComponent implements OnInit {

  public displayedColumns= ['sensor','datum','temparatur','luftfeuchtigkeit','standort','position','delete'];
  public get SensorPosition() {return SensorPosition; }

  dataSource = new MatTableDataSource<Sensorendata>();
  dataSize=0;
  dataLoading = false;

  @ViewChild(MatPaginator) page!: MatPaginator;

  constructor(private backendService: BackendService, public storeService: StoreService) { }

  async ngOnInit() {
    this.dataLoading= true;
    var data = await this.backendService.getSensorenDatenPaged(0,10);
    this.dataSource.data= data.sensorenDaten;
    this.dataSize = data.length;
    this.dataLoading= false;

  }

  async onPaginateChange(event:PageEvent){
    this.dataSource.data=[];
    this.dataLoading= true;
    const data = await this.backendService.getSensorenDatenPaged(event.pageIndex +1,event.pageSize); // +1 weil idx 0 und 1 die selben daten liefern

    this.dataSource.data= data.sensorenDaten;
    this.dataSize = data.length;
    this.dataLoading= false;
  }

  async deleteSensordata(id: number) {
    await this.backendService.deleteSensorsDaten(id);
  }
}
