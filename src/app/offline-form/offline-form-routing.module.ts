import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfflineForm } from './offline-form.page';
import { ShowDataComponent } from './components/show-data/show-data.component';

const routes: Routes = [
  {
    path: '',
    component: OfflineForm,
  },
  {
    path: 'show-data',
    component: ShowDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class OfflineFormPageRoutingModule {}
