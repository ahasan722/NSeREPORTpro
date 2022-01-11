import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { UserData } from 'src/app/providers/user-data';



@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  isShowing: boolean = false;
  loadingOptions: LoadingOptions = {
    animated: true,
    spinner: 'dots',
    translucent: true,
    backdropDismiss: true,
    keyboardClose: true,
    mode: 'ios',
    cssClass: "loading-css"
  };

  loadersArr: HTMLIonLoadingElement[] = [];


  constructor(
    private userDataService: UserData,
    public loadingController: LoadingController) { }

  intercept(request: HttpRequest<any>, next: HttpHandler,
  ): Observable<HttpEvent<any>> {


    const token = this.userDataService.getUserLoginApiData()?.token;

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
    //Authentication by setting header with token value
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': "Bearer " + token
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return from(this.handleCoreReq(request, next));

  }


  async handleCoreReq(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    if (!this.isShowing) {
      let loader = await this.loadingController.create(this.loadingOptions);
      await loader.present();
      this.isShowing = true;
      this.loadersArr.push(loader);
    }

    return next.handle(req).pipe(
      map(async (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log("%s %O \n%s %O", "Response Params",
            {
              "url ": event.url,
              "status": event.status,
              "successful": event.ok,
              "Response Body": event.body
            });
        }
        setTimeout(async () => {
          while (this.loadersArr.length > 0) {
            await this.loadersArr.pop().dismiss();
          }
          this.isShowing = false;
        }, 500);
        return event;
      }),
      catchError(async (error: HttpErrorResponse) => {
        setTimeout(async () => {
          while (this.loadersArr.length > 0) {
            await this.loadersArr.pop().dismiss();
          }
          this.isShowing = false;
        }, 500);
        return throwError(error).toPromise();
      })).toPromise();
  }


  async dismissLoaderArray() {

    while (this.loadersArr.length > 0) {
      await this.loadersArr.pop().dismiss();
    }
    this.isShowing = false;

  }



}


/**
 *  'content-type': 'application/json',
 * 'Access-Control-Allow-Origin': '*',
 * 'Access-Control-Allow-Headers': '*',
 * 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
 */
