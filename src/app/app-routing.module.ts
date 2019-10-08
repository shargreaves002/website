import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { paths } from './app-paths';
import {PathResolveService} from './services/path-resolve.service';
import {NotFoundComponent} from './not-found/not-found.component';
import {ContactSuccessComponent} from './contact-success/contact-success.component';
import {ContactFailureComponent} from './contact-failure/contact-failure.component';


const routes: Routes = [{path: paths.home, component: HomeComponent},
                        {path: paths.contact, component: ContactComponent},
                        {path: paths.contact_success, component: ContactSuccessComponent},
                        {path: paths.contact_failure, component: ContactFailureComponent},
                        {path: '', pathMatch: 'full', redirectTo: paths.home},
                        {path: '**', resolve: {path: PathResolveService}, component: NotFoundComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
