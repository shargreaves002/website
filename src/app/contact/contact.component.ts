import { Component, OnInit } from '@angular/core';
import { SendMailServiceService } from '../services/send-mail-service.service';
import {from, Subscription} from 'rxjs';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import axios from 'axios';
import { AxiosInstance } from 'axios';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private http: HttpClient) {}

  // TODO: make a back end to email this data to me
  processForm = async (e) => {
    console.log('post request sending');
    e.preventDefault();
    await axios.post('/api/contact', {
      name: e.name,
      email: e.email,
      message: e.message
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });

    console.log('post request sent');
  }
}
