import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { throwError } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm: any = {};
  response: string;

  ngOnInit() {
  }

  onSubmit = async (f: NgForm) => {
    const data = JSON.stringify({
      name: this.contactForm.name,
      email: this.contactForm.email,
      message: this.contactForm.message
    });

    await axios.post('/api/contact', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(() => {
        this.response = 'Thank you for contacting me!';
        f.resetForm();
      })
      .catch(err => {
        this.response = 'Sorry, it looks like there was an error. Please try again later.';
        throwError(err);
      });
  }
}
