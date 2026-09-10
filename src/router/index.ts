import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login/Login.vue'
import Home from '../pages/Home/Home.vue'
import PatientHome from '../pages/Patient/PatientHome.vue'
import AdmHome from '../pages/Adm/AdmHome.vue'
import CreatePsychologist from '../pages/Adm/AdmPsy/AdmCreatePsychologist/CreatePsychologist.vue'
import ListPsychologists from '../pages/Adm/AdmPsy/AdmListPsychologists/ListPsychologists.vue'
import DeletePsychologist from '../pages/Adm/AdmPsy/AdmDeletePsychologist/DeletePsychologist.vue'
import UpdatePsychologist from '../pages/Adm/AdmPsy/AdmUpdatePsychologist/UpdatePsychologist.vue'
import AdmCreatePatient from '../pages/Adm/AdmPatient/AdmCreatePatient/CreatePatient.vue'
import AdmListPatients from '../pages/Adm/AdmPatient/AdmListPatient/ListPatient.vue'
import AdmRequest from '../pages/Adm/AdmPsy/AdmRequest/AdmRequest.vue'
import PsyHome from '../pages/Psy/PsyHome.vue'
import PsyCreatePatient from '../pages/Psy/Patient/PsyCreatePatient/CreatePatient.vue'
import PsyListPatient from '../pages/Psy/Patient/PsyListPatient/ListPatient.vue'
import PsyAvailability from '../pages/Psy/PsyAvailability/Availability.vue'
import Agenda from '../pages/Patient/Agenda/Agenda.vue'
import PatientAppointments from '../pages/Patient/PatientAppointments/PatientAppointments.vue'
import PsyAppointments from '../pages/Psy/PsyAppointments/PsyAppointments.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/patient', name: 'PatientHome', component: PatientHome },
  { path: '/patient/agenda', name: 'Agenda', component: Agenda },
  { path: '/admin', name: 'AdmHome', component: AdmHome },
  { path: '/admin/psychologist/create', name: 'CreatePsychologist', component: CreatePsychologist },
  { path: '/admin/psychologist/list', name: 'ListPsychologists', component: ListPsychologists },
  { path: '/admin/psychologist/delete/:id', name: 'DeletePsychologist', component: DeletePsychologist },
  { path: '/admin/psychologist/update/:id', name: 'UpdatePsychologist', component: UpdatePsychologist },
  { path: '/admin/patient/create', name: 'AdmCreatePatient', component: AdmCreatePatient },
  { path: '/admin/patient/list', name: 'AdmListPatient', component: AdmListPatients },
  { path: '/admin/request', name: 'AdmRequest', component: AdmRequest },
  { path: '/psychologist', name: 'PsyHome', component: PsyHome },
  { path: '/patient/create', name: 'PsyCreatePatient', component: PsyCreatePatient },
  { path: '/patient/list', name: 'PsyListPatient', component: PsyListPatient },
  { path: '/psychologist/availability', name: 'PsyAvailability', component: PsyAvailability },
  { path: '/patient/appointments', name: 'PatientAppointments', component: PatientAppointments },
  { path: '/psychologist/appointments', name: 'PsyAppointments', component: PsyAppointments },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
