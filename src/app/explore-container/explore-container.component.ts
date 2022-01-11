import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  constructor() { }

  ngOnInit() {}


 celsius:number = 0;
 fahrenheit:number = 0;
 precision = 2;

 round(value:number):number {
   var multiplier = Math.pow(10, this.precision || 0);
   return Math.round(value * multiplier) / multiplier;
 }

 onChange(temperature:number ,type:string){
   if (temperature == null) {
     this.celsius = 0;
     this.fahrenheit = 0;
     return;
   }


   if (type === "c") {
     this.fahrenheit = this.round((temperature * 9) / 5 + 32);
   } else {
     this.celsius = this.round(((temperature - 32) * 5) / 9);
   }

 }



 title = 'Weather Details';
 cityName:string = '';
 searchedData?: data = undefined;
 weatherData = [
   {
     "name": "San Jose",
     "temperature": "36º F",
     "wind": "31Kmph",
     "humidity": "66%"
   },
   {
     "name": "Seattle",
     "temperature": "30º F",
     "wind": "4Kmph",
     "humidity": "9%"
   },
   {
     "name": "New York",
     "temperature": "20º F",
     "wind": "8Kmph",
     "humidity": "61%"
   },
   {
     "name": "Chicago",
     "temperature": "27º F",
     "wind": "35Kmph",
     "humidity": "2%"
   },
   {
     "name": "Atlanta",
     "temperature": "22º F",
     "wind": "25Kmph",
     "humidity": "5%"
   },
   {
     "name": "Austin",
     "temperature": "25º F",
     "wind": "1Kmph",
     "humidity": "5%"
   },
   {
     "name": "Denver",
     "temperature": "30º F",
     "wind": "8Kmph",
     "humidity": "48%"
   }
 ];


 onCityNameChange(value:any){
   console.log(value);
    this.searchedData = this.weatherData.find((item)=>{
      if(item.name.toLowerCase() == value.toLowerCase()){
       return item;
    }
   });
 }

}


interface data {
  name: string;
  temperature: string;
  wind: string;
  humidity: string;
}
