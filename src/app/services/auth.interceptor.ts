import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{

    constructor(private loginService:LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // throw new Error('Method not Implemented');


        let newReq = req;
        let token = this.loginService.getToken()

        console.log("INTERCEPTOR",token);

        if (token != null) {
            // Clone the request and set the Authorization header
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(newReq)
    }
}