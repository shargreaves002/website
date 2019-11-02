import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private router: Router) {}

  // TODO: make a back end to email this data to me
  processForm = async (e) => {
    console.log('post request sending');
    e.preventDefault();
    const data = JSON.stringify({
      name: e.name,
      email: e.email,
      message: e.message
    });
    await axios.post('/api/contact', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        this.router.navigate(['contact-success']);
      })
      .catch(err => {
        this.router.navigate(['contact-failure']);
      });
  }
}
