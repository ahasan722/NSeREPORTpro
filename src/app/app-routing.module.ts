import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [

  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'tour',
    loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialModule),
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'camp-submission/:facilityIndex',
    loadChildren: () => import('./camp-activities-list/camp-submission.module').then( m => m.CampSubmissionPageModule)
  },
  {
    path: 'camp-draft-data/:facilityIndex',
    loadChildren: () => import('./camp-draft-data-list/camp-draft-data.module').then( m => m.CampDraftDataPageModule)
  },
  {
    path: 'camp-final-data/:facilityIndex',
    loadChildren: () => import('./camp-final-data-list/camp-final-data.module').then( m => m.CampFinalDataPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
