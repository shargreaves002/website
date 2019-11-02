import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private router: Router) {}
  name: any;
  message: any;
  email: any;

  ngOnInit() {
  }

  // TODO: make a back end to email this data to me
  processForm = async () => {
    this.name = String($('#name').val());
    this.email = String($('#email').val());
    this.message = String($('#message').val());
    const data = JSON.stringify({
      name: this.name,
      email: this.email,
      message: this.message
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
