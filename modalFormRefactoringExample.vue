// Not usual code style, mb some dev. wouild not alway understand this on quck view, 
but it could be much more faster then 'CASE' or 'ELSE', in case when you have for examle 100 forms or 1000 ???)


<!--- This is code refactoring example of modal form components --> 

<template>
  <div>
    <b-modal
      id="ConfirmDeleteClinicModal"
      ref="ConfirmDeleteClinicModal"
      hide-header-close
      lazy
      @ok="handler"
    >{{ $t('modals.deleteClinic') }}
    </b-modal>

    <b-modal
      id="ConfirmDeleteAccountModal"
      ref="ConfirmDeleteAccountModal"
      hide-header-close
      lazy
      @ok="handler">
      {{ $t('modals.deleteAccount') | upperFirst }}
    </b-modal>

    <b-modal
      v-if="decodedTokenGetter.role === SUPER_ADMIN"
      id="changePasswordModal"
      ref="changePasswordModal"
      :title="`${$t('modals.changeUserSettings')} ${data.selectedUserName}`">
      <admin-change-users-password/>
    </b-modal>

    <b-modal
      v-if="decodedTokenGetter.role === CLINIC_ADMIN"
      id="cancelAppointmentModal"
      ref="cancelAppointmentModal"
      class="cancel-appointment-modal"
      @ok="handler"
    >
      <div>
        <h2>{{ $t('modals.cancelAppointmentConfirm') | upperFirst }}</h2>
      </div>
    </b-modal>

    <b-modal
      v-if="decodedTokenGetter.role === CLINIC_ADMIN"
      id="clientInfoModal"
      ref="ClientInfoModal"
      class="client-info-modal"
      hide-footer>
      <patient-provider-info-modal
        v-if="data.appointment && modal === 'ClientInfoModal'"
        :appointment="data.appointment"/>
    </b-modal>

    <b-modal
      v-if="decodedTokenGetter.role === CLINIC_ADMIN"
      id="AppointmentNotesModal"
      ref="AppointmentNotesModal"
      size="lg"
      class="client-info-modal"
      hide-footer>
      <AppointmentNotesModal
        v-if="data.appointment"
        :appointment="data.appointment"/>
    </b-modal>

    <b-modal
      ref="CreateClinicGroupModal"
      :title="$t('modals.createClinicGroup')"
      class="create-clinic-group-modal"
      button-size="middle"
      header-bg-variant="secondary"
      footer-class="d-flex justify-content-center"
      hide-header-close
      hide-footer
      @ok="handler">
      <create-clinic-group-modal
        v-if="decodedTokenGetter.role === CLINIC_ADMIN"
        :clinic-id="data.clinicId"/>
    </b-modal>

    <b-modal
      id="SoapModal"
      ref="SoapModal"
      class="client-info-modal"
      hide-footer>
      <SoapModal
        v-if="soapModalAvailable"
        :notes="data.notes"
        :appointment="data.appointment"
        @exit="handler"/>
    </b-modal>
    <b-modal
      id="endAppointmentModal"
      ref="endAppointmentModal"
      class="cancel-appointment-modal"
      @ok="handler"
    >
      <div>
        <h2>{{ $t('modals.finishAppointment') | upperFirst }}</h2>
      </div>
    </b-modal>


    <b-modal
      ref="BookingCancellationModal"
      :ok-title="$t('buttons.goBack') | upper"
      :cancel-title="$t('buttons.yesCancel') | upper"
      class="booking-cancellation-modal"
      button-size="middle"
      hide-header
      footer-class="d-flex justify-content-center"
      hide-header-close
      @cancel="handler.reset ? handler.reset() : handler"
      @ok="handler.back ? handler.back() : handler"
    >
      <booking-cancellation-modal/>
    </b-modal>

   <!--- ....--> 
  </div>
</template>

<script>
import { EventBus } from '@/helpers/EventBus.js';
import { mapGetters } from 'vuex';
import { ROLE, MODALS } from '@/constants/';

const AdminChangeUsersPassword = () => import('@/components/SuperAdmin/AdminChangeUsersPassword');
const PatientProviderInfoModal = () => import('@/modals/PatientProviderInfoModal');
const AppointmentNotesModal = () => import('@/modals/AppointmentNotes');
const CreateClinicGroupModal = () => import('@/modals/CreateClinicGroupModal');
const SoapModal = () => import('@/modals/SoapModal');
const EditProviderLicencesModal = () => import('@/modals/EditProviderLicencesModal');
const BookingCancellationModal = () => import('@/modals/BookingCancellationModal');
//..... 
export default {
  name: 'ModalHandler',
  components: {
    AdminChangeUsersPassword,
    PatientProviderInfoModal,
    AppointmentNotesModal,
    CreateClinicGroupModal,
    SoapModal,
    EditProviderLicencesModal,
    BookingCancellationModal,
   // .....
  },
  data: () => ({
    ...ROLE,
    MODALS: MODALS,
    handler: {},
    data: {},
    modal: ''
  }),
  computed: {
    ...mapGetters({
      decodedTokenGetter: 'decodedToken'
    }),
    soapModalAvailable() {
      return (
        this.decodedTokenGetter.role === this.PROVIDER ||
        (this.decodedTokenGetter.role === this.CLINIC_ADMIN && this.modal === this.MODALS.SOAP_MODAL)
      );
    }
  },
  created() {
  
  //// the code before refactoing 
  /* 
   EventBus.$on('showPopUp', ({ modal, handler, data }) => {
      console.log(this.$refs[modal]);
      this.handler = handler ? handler : () => ({});
      this.data = data ? data : () => ({});
      switch (modal) {
        case 'ConfirmDeleteClinicModal':
          this.$refs.ConfirmDeleteClinicModal.show();
          break;
        case 'ConfirmDeleteAccountModal':
          this.$refs.ConfirmDeleteAccountModal.show();
          break;
        case 'changePasswordModal':
          this.$refs.changePasswordModal.show();
          break;
        case 'cancelAppointmentModal':
          this.$refs.cancelAppointmentModal.show();
          break;
        case 'ClientInfoModal':
          this.$refs.ClientInfoModal.show();
          break;
        case 'AppointmentNotesModal':
          this.$refs.AppointmentNotesModal.show();
          break;
          case '.....':
          .....
      }
    });
  */
  // end code example before refactoring
  /////////////////////////////////////
  // code example after refactoring
  /////////////////////////////////////
  
    EventBus.$on('showPopUp', ({ modal, handler, data }) => {
      this.handler = handler ? handler : () => ({});
      this.data = data ? data : () => ({});
      this.modal = modal || '';
      this.$refs[modal].show();
    });
    
    /////// END code example after refactoring

    EventBus.$on('hidePopUp', ({ modal, handler, data }) => {
      this.handler = handler ? handler : () => ({});
      this.data = data ? data : () => ({});
      this.$refs[modal].hide();
    });
     /////// END code example after refactoring
     
  }
};
</script>

<style scoped>
</style>
