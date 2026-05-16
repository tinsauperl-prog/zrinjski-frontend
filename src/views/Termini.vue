<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-5 mt-5">Termini Treninga</h1>
        
        <v-btn color="primary" class="mb-4" @click="otvoriDodavanje">
          Dodaj novi termin
        </v-btn>

        <v-table class="elevation-1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Datum i Vrijeme</th> <th>Fokus Treninga</th> <th>Grupa</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="termin in termini" :key="termin.id">
              <td>{{ termin.id }}</td>
              <td>{{ termin.datum_vrijeme }}</td> <td>{{ termin.fokus_treninga }}</td> <td>{{ nadiImeGrupe(termin.grupa_id) }}</td>
              <td>
                <v-btn color="warning" size="small" class="mr-2" @click="pripremiUredivanje(termin)">Uredi</v-btn>
                <v-btn color="error" size="small" @click="pripremiBrisanje(termin.id)">Obriši</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ isEditing ? 'Uredi Termin' : 'Novi Termin' }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="formaTermin.datum_vrijeme" label="Datum i Vrijeme (npr. Pon 18:00)" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="formaTermin.fokus_treninga" label="Fokus (npr. Kondicija)" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="formaTermin.grupa_id"
                      :items="grupe"
                      item-title="naziv"
                      item-value="id"
                      label="Odaberi grupu"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="spremiTermin">Spremi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="400px">
          <v-card>
            <v-card-title class="text-h6">Potvrda brisanja</v-card-title>
            <v-card-text>Jeste li sigurni da želite obrisati ovaj termin?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="text" @click="obrisiTermin">Obriši</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const termini = ref([])
const grupe = ref([]) 

const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

// Ažurirana forma za termin
const formaTermin = ref({ id: null, datum_vrijeme: '', fokus_treninga: '', grupa_id: null })

const dohvatiTermine = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/termini')
  termini.value = await res.json()
}

const dohvatiGrupe = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/grupe')
  grupe.value = await res.json()
}

const nadiImeGrupe = (id) => {
  const g = grupe.value.find(x => x.id === id)
  return g ? g.naziv : 'Nema grupe'
}

const otvoriDodavanje = () => {
  isEditing.value = false
  formaTermin.value = { id: null, datum_vrijeme: '', fokus_treninga: '', grupa_id: null }
  dialog.value = true
}

const pripremiUredivanje = (termin) => {
  isEditing.value = true
  formaTermin.value = { ...termin }
  dialog.value = true
}

const spremiTermin = async () => {
  const metoda = isEditing.value ? 'PUT' : 'POST'
  const url = isEditing.value 
    ? `http://127.0.0.1:5000/api/termini/${formaTermin.value.id}` 
    : 'http://127.0.0.1:5000/api/termini'

  await fetch(url, {
    method: metoda,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formaTermin.value)
  })
  
  zatvoriDialog()
  dohvatiTermine()
}

const zatvoriDialog = () => { dialog.value = false }

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiTermin = async () => {
  await fetch(`http://127.0.0.1:5000/api/termini/${idZaBrisanje.value}`, { method: 'DELETE' })
  dialogBrisanje.value = false
  dohvatiTermine()
}

onMounted(() => {
  dohvatiGrupe().then(() => dohvatiTermine())
})
</script>