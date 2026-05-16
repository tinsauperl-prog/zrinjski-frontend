<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-5 mt-5">Treneri</h1>
        
        <v-btn color="primary" class="mb-4" @click="otvoriDodavanje">
          Dodaj novog trenera
        </v-btn>

        <v-table class="elevation-1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Certifikat</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trener in treneri" :key="trener.id">
              <td>{{ trener.id }}</td>
              <td>{{ trener.ime }}</td>
              <td>{{ trener.prezime }}</td>
              <td>{{ trener.certifikat }}</td>
              <td>
                <v-btn color="warning" size="small" class="mr-2" @click="pripremiUredivanje(trener)">Uredi</v-btn>
                <v-btn color="error" size="small" @click="pripremiBrisanje(trener.id)">Obriši</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ isEditing ? 'Uredi Trenera' : 'Novi Trener' }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="formaTrener.ime" label="Ime" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="formaTrener.prezime" label="Prezime" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formaTrener.certifikat" label="Certifikat" variant="outlined"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="spremiTrenera">Spremi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="400px">
          <v-card>
            <v-card-title class="text-h6">Potvrda brisanja</v-card-title>
            <v-card-text>Jeste li sigurni da želite obrisati ovog trenera?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="text" @click="obrisiTrenera">Obriši</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const treneri = ref([])
const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

const formaTrener = ref({
  id: null,
  ime: '',
  prezime: '',
  certifikat: ''
})

const dohvatiTrenere = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/treneri')
    const data = await response.json()
    treneri.value = data
  } catch (error) {
    console.error("Greška pri dohvaćanju:", error)
  }
}

const otvoriDodavanje = () => {
  isEditing.value = false
  formaTrener.value = { id: null, ime: '', prezime: '', certifikat: '' }
  dialog.value = true
}

const pripremiUredivanje = (trener) => {
  isEditing.value = true
  formaTrener.value = { ...trener } 
  dialog.value = true
}

const spremiTrenera = async () => {
  try {
    if (isEditing.value) {
      await fetch(`http://127.0.0.1:5000/api/treneri/${formaTrener.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formaTrener.value)
      })
    } else {
      await fetch('http://127.0.0.1:5000/api/treneri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formaTrener.value)
      })
    }
    zatvoriDialog()
    dohvatiTrenere()
  } catch (error) {
    console.error("Greška pri spremanju:", error)
  }
}

const zatvoriDialog = () => {
  dialog.value = false
}

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiTrenera = async () => {
  try {
    await fetch(`http://127.0.0.1:5000/api/treneri/${idZaBrisanje.value}`, {
      method: 'DELETE'
    })
    dialogBrisanje.value = false
    dohvatiTrenere()
  } catch (error) {
    console.error("Greška pri brisanju:", error)
  }
}

onMounted(() => {
  dohvatiTrenere()
})
</script>