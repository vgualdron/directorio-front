<template>
  <div class="q-pa-md">
    <q-table
      v-if="data && data.length > 0"
      title="Usuarios"
      :data="data"
      :columns="columns"
      row-key="name"
      :selected.sync="selected"
      :loading="isLoadingTable" :filter="filter"
      :pagination.sync="pagination">
      <template v-slot:top>
        <q-btn color="primary" label="Agregar nuevo" @click="addRow" :disable="isDiabledAdd"/>
        <q-space />
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn icon="delete" color="primary" flat size="sm" class="col q-ml-sm"
              @click="openModal('delete', props.row)"
              :disable="(props.row.listings && props.row.listings.length > 0)
              || (props.row.configurations && props.row.configurations.length > 0)"/>
          </q-td>
          <q-td key="name" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.name }}
            <q-popup-edit :value="props.row.name" v-slot="scope" buttons
              @input="val => save('name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="email" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.email }}
            <q-popup-edit :value="props.row.email" v-slot="scope" buttons
              @input="val => save('email', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="role" :props="props">
            <q-icon size="xs" name="edit" />
            {{ optionsRoles.find((item) => props.row.role === item.value) }}
            <q-popup-edit
              :value="optionsRoles.find((item) => props.row.role === item.value)"
              v-slot="scope"
              @input="val => save('role', val)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsRoles"/>
            </q-popup-edit>
          </q-td>
          <q-td key="address" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.address }}
            <q-popup-edit :value="props.row.address" v-slot="scope" buttons
              @input="val => save('address', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="phone" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.phone }}
            <q-popup-edit :value="props.row.phone" v-slot="scope" buttons
              @input="val => save('phone', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <form-user v-if="showModal" v-model="showModal"/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import FormUser from 'components/user/FormUser.vue';
import userTypes from '../../store/modules/user/types';

export default {
  data() {
    return {
      isLoadingTable: false,
      selected: [],
      itemSelected: {},
      optionsRoles: [
        {
          label: 'Administrador',
          value: 'admin',
        },
        {
          label: 'Lider',
          value: 'leader',
        },
        {
          label: 'Ayudante',
          value: 'assistant',
        },
        {
          label: 'Cliente',
          value: 'client',
        },
      ],
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'left',
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true,
        },
        {
          name: 'role', label: 'Rol', field: 'role', sortable: true, style: 'width: 10px', align: 'center',
        },
        {
          name: 'address', label: 'Dirección', field: 'address', sortable: true, align: 'center',
        },
        {
          name: 'phone', label: 'Phone', field: 'phone', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10), align: 'center',
        },
      ],
      pagination: {
        rowsPerPage: 30,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.fetchUsers();
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(userTypes.PATH, [
      'users',
    ]),
    data() {
      return [...this.users];
    },
  },
  methods: {
    ...mapActions(userTypes.PATH, {
      fetchUsers: userTypes.actions.FETCH_USERS,
      updateUser: userTypes.actions.UPDATE_USER,
      deleteUser: userTypes.actions.DELETE_USER,
    }),
    async save(field, value) {
      this.isLoadingTable = true;
      this.itemSelected[field] = value.value || value;
      await this.updateUser(this.itemSelected);
      await this.fetchUsers();
      this.isLoadingTable = false;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addRow() {
      this.showModal = true;
    },
    openModal(action, row) {
      if (action === 'delete') {
        this.$q.dialog({
          title: 'Eliminar',
          message: 'Está seguro que desea eliminar el usuario?',
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: 'negative',
            text: 'adsa',
          },
          persistent: true,
        }).onOk(async () => {
          this.isLoadingTable = true;
          await this.deleteUser(row.id);
          await this.fetchUsers();
          this.isLoadingTable = false;
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      }
    },
  },
  components: {
    FormUser,
  },
};
</script>
