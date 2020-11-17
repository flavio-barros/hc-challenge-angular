import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Report } from './report';
import { User } from './user';
import { isNull } from 'util';

@Injectable({
  providedIn: 'root'
})

export class DataService {

    private REST_API_SERVER = "http://localhost:8000";

    constructor(private httpClient: HttpClient) { }

    handleError(error: HttpErrorResponse){
        let errorMessage = "Unknown error.";
        if(error.error instanceof ErrorEvent){
            errorMessage = "Error: "+error.error.message;
        }else{
            errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    public getReports(paginationLimit: Number = null, 
        paginationOffset: Number = null, userId: string = null){
        let params = new HttpParams();

        if(paginationLimit){
            params = params.append("pagination_limit", paginationLimit.toString());
        }

        if(paginationOffset){
            params = params.append("pagination_offset", paginationOffset.toString());
        }

        if(userId){
            params = params.append("user_id", userId);
        }
        
        return this.httpClient.
            get<any>(this.REST_API_SERVER+"/reports", 
                {observe: "response", params: params}).
            pipe(retry(5), catchError(this.handleError));
    }

    public getUsers(){

        return this.httpClient.
            get<User[]>(this.REST_API_SERVER+"/users", {observe: "response"}).
            pipe(retry(5), catchError(this.handleError));
    }
}
