import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams } from 'ionic-angular';
import { VideoPlayer ,VideoOptions } from '@ionic-native/video-player';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  livemois: any;
  userDetails : any;
  responseData: any;
  items: any;
  userPostData = {"user_id":"","token":""};
  constructor(public navCtrl: NavController,
    private streamingMedia: StreamingMedia,
    private videoPlayer : VideoPlayer,
    private youtube: YoutubeVideoPlayer,
    public app: App,
    public authService: AuthServiceProvider,
    public restapiService: RestapiServiceProvider,
    public navParams: NavParams) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
    
      this.userPostData.user_id = this.userDetails.user_id;
      this.userPostData.token = this.userDetails.token;
      this.getlivemois(event);
     // this.getCctvs();
      
      //this.youtube.openVideo('zVDFS2jE9AM');
  }

  getlivemois(event) {
    this.restapiService.getYoutubeLive()
    .then(data => {
      this.livemois = data;
    });
  }

  openVideo(videoId) {
    this.youtube.openVideo(videoId);
  }

  //เลื่อนลง refresh
  doRefresh(refresher){
    this.restapiService.getYoutubeLive()
    .then(data => {
      this.livemois = data;
      refresher.complete();
    },(error)=> {
      console.log(error);
      });
   }


  openVideo2() {
    this.youtube.openVideo('zVDFS2jE9AM');
  }

  playVideo(videoId) {
    this.youtube.openVideo(videoId);
  }
  
  getCctvs() {
    this.restapiService.getCctv()
    .then(data => {
      this.items = data;
    });
  }

  startVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Finished Video') },
      errorCallback: (e) => { console.log('Error: ', e) },
      orientation: 'landscape'
    };
 
    // http://www.sample-videos.com/
    this.streamingMedia.playVideo('http://61.91.13.223/live/dopatv03.m3u8', options);
  }

  startVideo2() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Finished Video') },
      errorCallback: (e) => { console.log('Error: ', e) },
      orientation: 'landscape'
    };
 
    // VCS
    this.streamingMedia.playVideo('http://123.242.182.84/live/index.m3u8', options);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

    
  backToWelcome(){
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout(){
      localStorage.clear();
      setTimeout(() => this.backToWelcome(), 1000);
  }

}
