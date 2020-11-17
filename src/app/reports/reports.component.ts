import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Report } from '../report';
import { User } from '../user';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class ReportsComponent implements OnInit, OnDestroy {

    reports: Report[] = [];
    displayedColumns: string[] = ['author', 'email', 'supervisors'];
    expandedElement: Report | null;

    showReports = [5, 10, 20, 50];

    users: User[] = [];

    paginationOffset = new FormControl('', [Validators.min(0)]);
    paginationLimit = new FormControl('', [Validators.min(1)]);

    selectUsers = new FormControl();

    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataService.getReports().
            pipe(takeUntil(this.destroy$)).
            subscribe((res: HttpResponse<Report[]>) => {
                this.reports = res.body;
        });

        this.dataService.getUsers().
            pipe(takeUntil(this.destroy$)).
            subscribe((res: HttpResponse<User[]>) => {
                this.users = res.body;
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    changeUser(userId: string){
        this.dataService.getReports(this.paginationLimit.value, 
            this.paginationOffset.value, this.selectUsers.value).
        pipe(takeUntil(this.destroy$)).
        subscribe((res: HttpResponse<any>) => {
            if(res.body.results){
                this.reports = res.body.results;
            }else{
                this.reports = res.body;
            }
        
        });
    }

    getOffsetErrorMessage(){
        if(this.paginationOffset.hasError('min')){
            return "This value must be greater than or equal to 0";
        }
    }

    getLimitErrorMessage(){
        if(this.paginationLimit.hasError('min')){
            return "This value must be greater than 1"
        }
    }

    reloadTable(){
        if(this.paginationOffset.valid && this.paginationLimit.valid){
            this.dataService.getReports(this.paginationLimit.value, 
                    this.paginationOffset.value, this.selectUsers.value).
                pipe(takeUntil(this.destroy$)).
                subscribe((res: HttpResponse<any>) => {
                    if(res.body.results){
                        this.reports = res.body.results;
                    }else{
                        this.reports = res.body;
                    }
                
                });
        }
    }
}