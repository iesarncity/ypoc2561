import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { WeatherProvider, WeatherLocation } from "../../providers/weather/weather";
import { Storage } from "@ionic/storage";
/**
 * Generated class for the WeatherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
  weather: any;
  location: WeatherLocation;

  constructor(
        public navCtrl: NavController,
        public platform: Platform,
        private weatherProvider: WeatherProvider,
        private storage: Storage) {
  }

  getIconPath() {
    let iconPath: string = "",
        pref: string = '';

    if (this.weather && this.weather.length > 0 && this.weather[0].hasOwnProperty('WeatherIcon')) {
        pref = (this.weather[0].WeatherIcon.toString().length == 1) ? '0' + this.weather[0].WeatherIcon.toString() : this.weather[0].WeatherIcon.toString();
        iconPath = 'https://developer.accuweather.com/sites/default/files/' + pref + '-s.png';
    }

    return iconPath;
    }

    getWeatherDate() {
        if (this.weather && this.weather.length > 0 && this.weather[0].hasOwnProperty('LocalObservationDateTime')) {
            var date = new Date(Date.parse(this.weather[0].LocalObservationDateTime));
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } else {
            return '';
        }
    }

    getPhotos() {
        var ph = [];
        if (this.weather && this.weather.length > 0 && this.weather[0].hasOwnProperty('Photos')) {
            ph = this.weather[0].Photos;
        }
        return ph;
    }

    updateLocation() {
        this.storage.get('location').then((val) => {
            if (val) {
                let location = JSON.parse(val);
                this.location = {
                    key: location.key,
                    city: location.city,
                    state: location.state
                };
            } else {
                this.location = {
                    key: '288372',
                    city: 'Юрга',
                    state: 'Кемерово'
                }
            }

            if (this.location) {
                this.weatherProvider.getWeather(this.location)
                    .subscribe(weather => {
                        // console.log(weather);
                        // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                        if (!weather) {
                            console.log('error while getting weather: empty response');
                            this.weather = null;
                        } else if (weather == []) {
                            console.log('there are no weather info');
                            this.weather = null;
                        } else if (weather.hasOwnProperty('Code')) {
                            console.log('API error while getting cities with code ' + weather.Code + ': ' + weather.Message);
                            this.weather = null;
                        } else {
                            console.log('Got weather');
                            // console.log(weather);
                            this.weather = weather;
                        }

                    })
            }
        });
    }

    ionViewWillEnter() {
        this.updateLocation();
        // this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }

    ionViewDidEnter() {
        // this.updateLocation();
        // this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
    }