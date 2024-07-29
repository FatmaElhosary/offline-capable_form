import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-record-voice',
  templateUrl: './record-voice.component.html',
  styleUrls: ['./record-voice.component.scss'],
})
export class RecordVoiceComponent  implements OnInit {
  //record
  mediaRecorder: any;
  audioChunks: any[] = [];
  audioBlob: any;
  audioUrl: SafeUrl | null = null;
  isRecording = false;
  ///////////////////////
  @Output() audio=new EventEmitter<string>();
  constructor(private _utils: UtilsService,  private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.initializeVoiceRecording();
  }
  
  initializeVoiceRecording(): void {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
          this._utils.convertFileToBase64(this.audioBlob, (base64: string) => {
            this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(base64);
            this.audio.emit(base64);
            //this.saveFormData();
          });
          /*  this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.offlineForm.controls['voiceInput'].setValue(this.audioBlob); */
          this.audioChunks = [];
          //this.saveFormDataLocally();
        };
      })
      .catch((error) => {
        this._utils.displayAlert('Error accessing microphone', 'Error');
        console.error('Error accessing microphone', error);
      });
  }

  startRecording() {
    try {
      if (this.mediaRecorder) {
        this.isRecording = true;
        this.mediaRecorder.start();
      }
    } catch (e) {
      this._utils.displayAlert('Please Enable accessing microphone', 'Error');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.isRecording = false;
      this.mediaRecorder.stop();
    }
  }

  clearFormField(){
    this.audioUrl='';
   
  }

  /*   playAudio(): void {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  } */

}
