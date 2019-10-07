import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { paths } from './app-paths';
import {PathResolveService} from './services/path-resolve.service';
import {NotFoundComponent} from './not-found/not-found.component';


const routes: Routes = [{path: paths.home, component: HomeComponent},
                        {path: paths.contact, component: ContactComponent},
                        {path: '', pathMatch: 'full', redirectTo: paths.home},
                        {path: '**', resolve: {path: PathResolveService}, component: NotFoundComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
