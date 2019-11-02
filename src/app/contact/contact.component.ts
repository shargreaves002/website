import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  ngOnInit() {
  }

  constructor() {}

  // TODO: make a back end to email this data to me
  processForm = async (e) => {
    console.log('post request sending');
    e.preventDefault();
    await axios.post('/api/contact', {
      name: e.name,
      email: e.email,
      message: e.message
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
