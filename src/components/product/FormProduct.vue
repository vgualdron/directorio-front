<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar nuevo plan</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-select outlined v-model="categorie_id" label="Categoria *"
              hint="Seleccione la categoria" lazy-rules :options="optionsCategories"
              :rules="[(val) => (!!val) || 'La categoria es requerida']" />
            <q-input outlined v-model="name" label="Nombre *" hint="Escriba el nombre"
              lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']" />
            <q-input v-model="description" hint="Escriba la descripción" label="Descripción"
              outlined/>
            <q-input outlined v-model="price" label="Precio *" hint="Escriba precio" type="number"
              lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']" />
            <q-input outlined v-model="priority" label="Prioridad *" hint="Escriba la prioridad"
              lazy-rules :rules="[val => val && val > 0 || 'Este campo es obligatorio']"
              type="number"/>
            <q-separator />
            <div class="row text-center">
              <q-btn label="cancelar" type="reset" color="primary" :disable="isLoading"
                outline class="col" v-close-popup/>
              <q-btn label="Aceptar" type="submit" color="primary" :loading="isLoading"
                class="col q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import productTypes from '../../store/modules/product/types';
import categoryTypes from '../../store/modules/category/types';

export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
      name: '',
      description: '',
      price: '',
      priority: '',
      categorie_id: '',
    };
  },
  computed: {
    ...mapState(productTypes.PATH, [
      'statusAddProduct',
    ]),
    ...mapState(categoryTypes.PATH, [
      'categories',
    ]),
    optionsCategories() {
      return this.categories.map(({ id, name }) => ({ label: name, value: id }));
    },
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(productTypes.PATH, {
      fetchProducts: productTypes.actions.FETCH_PRODUCTS,
      addProduct: productTypes.actions.ADD_PRODUCT,
    }),
    async onSubmit() {
      this.isLoading = true;
      await this.addProduct({
        name: this.name,
        description: this.description,
        price: this.price,
        priority: this.priority,
        categorie_id: this.categorie_id.value || this.categorie_id,
      });
      if (this.statusAddProduct.errors) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          message: this.statusAddProduct.message,
        });
      } else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Producto agregado con éxito',
        });
        this.showDialog = false;
        await this.fetchProducts();
      }
      this.isLoading = false;
    },
  },
};
</script>
